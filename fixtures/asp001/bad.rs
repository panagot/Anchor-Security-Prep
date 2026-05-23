use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp001 {
    use super::*;

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.amount = vault.amount.checked_sub(amount).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub user: AccountInfo<'info>,
}

#[account]
pub struct Vault {
    pub amount: u64,
}
