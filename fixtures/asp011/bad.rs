use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111112");

#[program]
pub mod fixture_asp011 {
    use super::*;
    pub fn ensure(ctx: Context<EnsureBad>) -> Result<()> {
        let acct = &mut ctx.accounts.slot;
        acct.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct EnsureBad<'info> {
    #[account(init_if_needed, payer = payer, space = 8 + 8)]
    pub slot: Account<'info, Slot>,
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Slot {
    pub count: u64,
}
