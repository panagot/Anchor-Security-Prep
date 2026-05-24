use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp022 {
    use super::*;

    pub fn transfer(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        let _ = amount;
        let _ = &ctx.accounts.mint;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub from: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}
