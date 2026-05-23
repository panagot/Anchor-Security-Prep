use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;

declare_id!("Fix99999999999999999999999999999999999999");

#[program]
pub mod fixture_asp009 {
    use super::*;
    pub fn deposit(_ctx: Context<DepositBad>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct DepositBad<'info> {
    pub token: Account<'info, TokenAccount>,
}
