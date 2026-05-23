use anchor_lang::prelude::*;

declare_id!("Fix23232323232323232323232323232323232323");

#[program]
pub mod fixture_asp023 {
    use super::*;
    pub fn set_admin(ctx: Context<SetAdminBad>, admin: Pubkey) -> Result<()> {
        ctx.accounts.config.admin = admin;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetAdminBad<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
}

#[account]
pub struct Config {
    pub admin: Pubkey,
}

pub fn default_admin() -> Pubkey {
    Pubkey::default()
}
