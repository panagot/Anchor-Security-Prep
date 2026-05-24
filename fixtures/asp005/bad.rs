use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp005 {
    use super::*;

    pub fn update(ctx: Context<Update>, amount: u64) -> Result<()> {
        ctx.accounts.vault.amount = amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub authority: AccountInfo<'info>,
}

#[account]
pub struct Vault {
    pub amount: u64,
}
