use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp024 {
    use super::*;

    pub fn deposit(_ctx: Context<Deposit>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub owner: Signer<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
