use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp015 {
    use super::*;

    pub fn migrate(ctx: Context<Migrate>) -> Result<()> {
        ctx.accounts.config.version = 2;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Migrate<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    pub caller: AccountInfo<'info>,
}

#[account]
pub struct Config {
    pub version: u32,
}
