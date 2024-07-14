import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PdaIndex } from "../target/types/pda_index";
import {PublicKey, LAMPORTS_PER_SOL,Connection} from '@solana/web3.js';

describe("pda_index", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);

  const program     = anchor.workspace.PdaIndex as Program<PdaIndex>;
  const dataKeypair = anchor.web3.Keypair.generate();
  const pdaKeypair  = anchor.web3.Keypair.generate();


  // this airdrops sol to an address
  async function airdropSol(publicKey, amount) {
    let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdropTx);
  }

  async function confirmTransaction(tx) {
    const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
    await anchor.getProvider().connection.confirmTransaction({
      blockhash           : latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature           : tx,
    });
  }


  async function getBalance(provider, publicKey) {
    return await provider.connection.getBalance(publicKey);
  }


  it("Is initialized!", async () => {

    // await airdropSol(dataKeypair.publicKey, 1e9); // 1 SOL
    // await airdropSol(pdaKeypair.publicKey, 1e9); // 1 SOL

    const tx = await program.methods.initialize()
    .accounts({
        data         : dataKeypair.publicKey,
        signer       : provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([dataKeypair])
      .rpc();

      console.log("Your transaction signature", tx);

    let signer = anchor.web3.Keypair.generate();
    await airdropSol(signer.publicKey, 1); // 1 SOL
    const balance = getBalance(provider, signer.publicKey);
    console.log("Signer balance", (await balance).toString());

    const dataAccount     = await program.account.data.fetch(dataKeypair.publicKey);
    const dataIndex       = dataAccount.index;
    const dataIndexBuffer = Buffer.allocUnsafe(2);
    dataIndexBuffer.writeUInt16LE(dataIndex, 0);

    // Calculer l'adresse de la PDA
    const [pdaPubkey, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("PDA"),
        signer.publicKey.toBuffer(),
        dataIndexBuffer,
      ],
      program.programId
    );

    let pda = {
      pubkey: pdaPubkey,
      bump  : bump,
    };

    let txPda = await program.methods.createPda()
      .accounts({
        pda          : pda.pubkey,
        data         : dataKeypair.publicKey,
        signer       : signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([signer])
      .rpc();

    //console.log("Your transaction signature :", txPda);
    console.log("");
    console.log("https://solana.fm/tx/"+txPda);
    console.log("");

//----
    const dataAccount2     = await program.account.data.fetch(dataKeypair.publicKey);
    const dataIndex2       = dataAccount2.index;
    const dataIndexBuffer2 = Buffer.allocUnsafe(2);
    dataIndexBuffer2.writeUInt16LE(dataIndex2, 0);

    // Calculer l'adresse de la PDA
    const [pdaPubkey2, bump2] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("PDA"),
        signer.publicKey.toBuffer(),
        dataIndexBuffer2,
      ],
      program.programId
    );

    // console.log("===");
    // console.log(pdaPubkey2);

    pda = {
      pubkey: pdaPubkey2,
      bump  : bump2,
    };

    txPda = await program.methods.createPda()
      .accounts({
        pda          : pda.pubkey,
        data         : dataKeypair.publicKey,
        signer       : signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([signer])
      .rpc();

    console.log("");
    console.log("https://solana.fm/tx/"+txPda);
    console.log("");

  //----

    const indexFetch = 1; // exemple d'index pour la PDA
    const indexBuffer = Buffer.allocUnsafe(2);
    indexBuffer.writeUInt16LE(indexFetch, 0);
    // console.log(indexFetch);
    // console.log(indexBuffer);
    const seeds = [
      Buffer.from("PDA"),
      signer.publicKey.toBuffer(),
      indexBuffer,
    ];
    const [pdaPubkeyFetch, bumpFetch] = await anchor.web3.PublicKey.findProgramAddress(
      seeds,
      program.programId
    );

    // console.log("===");
    // console.log(pdaPubkeyFetch);

    const pdaAccount = await program.account.pda.fetch(pdaPubkeyFetch);
    console.log("PDA #", indexFetch);
    console.log("Index du PDA :", pdaAccount.index);
    console.log("Valeur du probe du PDA :", pdaAccount.probe);

  //----

    const all = await program.account.data.all();
    console.log(all);

  });

});
