use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[derive(Accounts)]
pub struct InitPda<'info> {
    #[account(
        init,
        payer = payer,
        space = 8,
        seeds = [b"seed"],
    )]
    pub data: Account<'info, Data>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Data {
    pub value: u64,
}
