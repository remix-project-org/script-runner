'use strict'
import "@babel/polyfill"
import { createClient } from '@remixproject/plugin-iframe'
import { PluginClient } from '@remixproject/plugin'
import * as ethersJs from 'ethers' // eslint-disable-line
import multihash from 'multihashes'
import * as web3Js from 'web3'
import Web3 from 'web3'
import { waffleChai } from "@ethereum-waffle/chai";
import * as starknet from 'starknet'
import * as zokratesJs from 'zokrates-js';
const circomlibjs = require('circomlibjs');
const snarkjs = require('snarkjs');
import * as zkkitIncrementalMerkleTree from '@zk-kit/incremental-merkle-tree';
import * as semaphoreProtocolProof from '@semaphore-protocol/proof'
// import * as semaphoreProtocolContracts from '@semaphore-protocol/contracts'
import * as semaphoreProtocolGroup from '@semaphore-protocol/group'
import * as semaphoreProtocolIdentity from '@semaphore-protocol/identity'
import * as semaphoreProtocolData from '@semaphore-protocol/data'
import * as chainlinkFunction from '@chainlink/functions-toolkit'
import * as spartanECDSA from '@personaelabs/spartan-ecdsa'
import * as ethereumjsUtil from '@ethereumjs/util'
import './runWithMocha'
import * as path from 'path'
// import * as hhEtherMethods from './hardhat-ethers/methods'
const ffjavascript = require('ffjavascript')
import * as sindri from 'sindri'
import { isBigInt } from 'web3-validator'
import { TranspileOutput } from "typescript"
import * as zksyncEthers from 'zksync-ethers'

const chai = require('chai')
chai.use(waffleChai);

declare global {
  interface Window {
    [key: string]: any;
    _starknet: any
    chai: any
    ethers: any
    multihashes: any
    snarkjs: any
    circomlibjs: any
    ffjavascript: any
    sindri: any
    remix: any
    require: any
  }
}

window._starknet = starknet;
window.chai = chai;
window.ethers = ethersJs;
window.multihashes = multihash;
window['zokrates-js'] = zokratesJs
window['snarkjs'] = snarkjs
window['circomlibjs'] = circomlibjs
window['@zk-kit/incremental-merkle-tree'] = zkkitIncrementalMerkleTree

window['@semaphore-protocol/proof'] = semaphoreProtocolProof
// window['@semaphore-protocol/contracts'] = semaphoreProtocolContracts
window['@semaphore-protocol/group'] = semaphoreProtocolGroup
window['@semaphore-protocol/identity'] = semaphoreProtocolIdentity
window['@semaphore-protocol/data'] = semaphoreProtocolData

window['@chainlink/functions-toolkit'] = chainlinkFunction
window['@personaelabs/spartan-ecdsa'] = spartanECDSA
window['@ethereumjs/util'] = ethereumjsUtil

window["ffjavascript"] = ffjavascript

window["sindri"] = sindri
window["zksync-ethers"] = zksyncEthers

const scriptReturns:  { [key: string]: any } = {} // keep track of modules exported values
const fileContents: { [key: string]: any } = {} // keep track of file content
window.require = (module: string) => {
  if (module === 'web3') return web3Js
  if (window[module]) return window[module] // library
  if (window['_' + module]) return window['_' + module] // library
  else if ((module.endsWith('.json') || module.endsWith('.abi')) && window.__execPath__ && fileContents[window.__execPath__]) return JSON.parse(fileContents[window.__execPath__][module])
  else if (window.__execPath__ && scriptReturns[window.__execPath__]) return scriptReturns[window.__execPath__][module] // module exported values
  else throw new Error(`${module} module require is not supported by Remix IDE`)
}

class CodeExecutor extends PluginClient {
  async execute (script: string | undefined, filePath: string) {
    filePath = filePath || 'scripts/script.ts'
    const paths = filePath.split('/')
    paths.pop()
    const fromPath = paths.join('/') // get current execcution context path
    if (script) {
      try {
        const ts = await import('typescript');
        const transpiled: TranspileOutput = ts.transpileModule(script, { moduleName: filePath, fileName: filePath,
        compilerOptions: {
         target: ts.ScriptTarget.ES2015,
         module: ts.ModuleKind.CommonJS,
         esModuleInterop: true,  
        }});
        script = transpiled.outputText;
        // extract all the "require", execute them and store the returned values.
        const regexp = /require\((.*?)\)/g
        const array = [...script.matchAll(regexp)];

        for (const regex of array) {
          let file = regex[1]
          file = file.slice(0, -1).slice(1) // remove " and '
          let absolutePath = file
          if (file.startsWith('./') || file.startsWith('../')) {            
            absolutePath = path.resolve(fromPath, file)
          }
          if (!scriptReturns[fromPath]) scriptReturns[fromPath] = {}
          if (!fileContents[fromPath]) fileContents[fromPath] = {}
          const { returns, content } = await this.executeFile(absolutePath)
          scriptReturns[fromPath][file] = returns
          fileContents[fromPath][file] = content
        }

        // execute the script
        script = `const exports = {};
                  const module = { exports: {} }
                  window.__execPath__ = "${fromPath}"
                  ${script};
                  return exports || module.exports`
        const returns = (new Function(script))()

        return returns
      } catch (e: any) {
        this.emit('error', {
          data: [e.message]
        })
      }
    }
  }

  async _resolveFile (fileName: string) {
    if (await this.call('fileManager' as any, 'exists', fileName)) return await this.call('fileManager', 'readFile', fileName)
    if (await this.call('fileManager' as any, 'exists', fileName + '.ts')) return await this.call('fileManager', 'readFile', fileName + '.ts')
    if (await this.call('fileManager' as any, 'exists', fileName + '.js')) return await this.call('fileManager', 'readFile', fileName + '.js')
  }

  async executeFile (fileName: string) {
    try {
      if (require(fileName)) return require(fileName)
    } catch (e) {}
    const content = await this._resolveFile(fileName)
    const returns = await this.execute(content, fileName)
    return {returns, content}
  }
}

window.remix = new CodeExecutor()
createClient(window.remix)

window.web3Provider = {
  sendAsync(payload: any, callback: any) {
    window.remix.call('web3Provider', 'sendAsync', payload)
      .then((result: any) => callback(null, result))
      .catch((e: any) => callback(e))
  }
}
window.provider = window.web3Provider
window.ethereum = window.web3Provider

window.web3 = new Web3(window.web3Provider)

// Support hardhat-ethers, See: https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html
const { ethers } = ethersJs
//ethers.provider = new ethers.providers.Web3Provider(window.web3Provider)
//for(const method in hhEtherMethods) Object.defineProperty(window.hardhat.ethers, method, { value: hhEtherMethods[method]})

const replacer = (key: string, value: any) => {
  if (isBigInt(value)) value = value.toString()
  if (typeof value === 'function') value = value.toString()
  return value
}
(console as any).logInternal = console.log
console.log = function () {
   window.remix.emit('log', {
     data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
   })
 };

(console as any).infoInternal = console.info;
console.info = function () {
  window.remix.emit('info', {
    data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
  })
};

(console as any).warnInternal = console.warn
console.warn = function () {
  window.remix.emit('warn', {
    data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
  })
};

(console as any).errorInternal = console.error
console.error = function () {
  window.remix.emit('error', {
    data: Array.from(arguments).map((el) => JSON.parse(JSON.stringify(el, replacer)))
  })
}