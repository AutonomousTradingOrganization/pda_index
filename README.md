# Indexed PDAs

## Overview

Just a quick sandbox to check how to manage indexec PDAs with Anchor and test script !

## Resources

- [Understanding Account Ownership in Solana: Transferring SOL out of a PDA](https://www.rareskills.io/post/solana-account-owner)
- [PDA (Program Derived Address) vs Keypair Account in Solana](https://www.rareskills.io/post/solana-pda)
- [SolDev - Anchor PDAs and Accounts](https://www.soldev.app/course/anchor-pdas)

## Launch

![](deploy_local_test.png)

### Local validator

`solana-test-validator --reset`

Beware it creates local files and directories at the current working directory.


### Real-time logs display

`solana logs`


### Deploy and launch tests

`anchor test --skip-local-validator`


## Versions

``` 
rustc 1.79.0 (129f3b996 2024-06-10)
cargo 1.79.0 (ffa9cf99a 2024-06-03)
solana-cli 1.18.17 (src:b685182a; feat:4215500110, client:SolanaLabs)
anchor-cli 0.29.0
yarn 1.22.19
node v18.16.0
npm 9.6.7
``` 

`cargo build-sbf -V`
``` 
solana-cargo-build-sbf 1.18.17
platform-tools v1.41
rustc 1.75.0
``` 
