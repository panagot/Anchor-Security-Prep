use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp025 {
    use super::*;

    pub fn process(ctx: Context<Process>) -> Result<()> {
        for acc in ctx.remaining_accounts.iter() {
            let _ = acc.key();
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Process<'info> {
    pub vault: Account<'info, Vault>,
}

#[account]
pub struct Vault {
    pub amount: u64,
}
