use anchor_lang::prelude::*;

declare_id!("Fix88888888888888888888888888888888888888");

#[program]
pub mod fixture_asp008 {
    use super::*;
    pub fn read_rent(_ctx: Context<ReadRentBad>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ReadRentBad<'info> {
    pub rent_sysvar: AccountInfo<'info>,
}
