use anchor_lang::prelude::*;use std::mem::size_of;


declare_id!("6ZriX4MQd2iVT9ETKdbVwucbTsW9H6LkgHpeYTtEzqzK");

#[program]
pub mod pda_index {
	use super::*;

	pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
	  	let data: &mut Account<Data> = &mut ctx.accounts.data;
		data.index = 0;
/*
*/
		let balance = ctx.accounts.data.to_account_info().lamports();
		msg!("balance in Lamports is {}", balance);

		Ok(())
	}

	pub fn create_pda(ctx: Context<CreatePda>) -> Result<()> {
		let data: &mut Account<Data> = &mut ctx.accounts.data;
		let pda: &mut Account<Pda>   = &mut ctx.accounts.pda;

		pda.index   = data.index;
		pda.probe   = 1337;
		data.index += 1;

		Ok(())
	}

}


#[account]
pub struct Data {
	pub index: u16,
}

#[account]
pub struct Pda {
	pub probe: u16,
	pub index: u16,
}



#[derive(Accounts)]
pub struct Initialize<'info> {
	#[account(
		init,
		payer = signer,
		space = size_of::<Data>() + 8
	)]
	pub data: Account<'info, Data>,

	#[account(mut)]
	pub signer: Signer<'info>,

	pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreatePda<'info> {
	#[account(
		init,
		seeds = [
			b"PDA".as_ref(),
			signer.key().as_ref(),
			data.index.to_le_bytes().as_ref(),
		],
		bump,
		payer = signer,
		space = size_of::<Pda>() + 8
	)]
	pub pda: Account<'info, Pda>,

	#[account(mut)]
	pub data: Account<'info, Data>,

	#[account(mut)]
	pub signer: Signer<'info>,

	pub system_program: Program<'info, System>,
}
