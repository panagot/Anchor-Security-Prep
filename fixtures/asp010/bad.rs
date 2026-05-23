use anchor_lang::prelude::*;

declare_id!("Fix10101010101010101010101010101010101010");

#[program]
pub mod fixture_asp010 {
    use super::*;
    pub fn process(ctx: Context<ProcessBad>) -> Result<()> {
        let _owner = ctx.accounts.external.owner;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessBad<'info> {
    pub external: UncheckedAccount<'info>,
}
