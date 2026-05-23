use anchor_lang::prelude::*;

declare_id!("Fix22222222222222222222222222222222222222");

#[program]
pub mod fixture_asp002 {
    use super::*;
    pub fn transfer(ctx: Context<TransferBad>, amount: u64) -> Result<()> {
        let from = ctx.accounts.from.to_account_info();
        **from.try_borrow_mut_lamports()? -= amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferBad<'info> {
    pub from: AccountInfo<'info>,
}
