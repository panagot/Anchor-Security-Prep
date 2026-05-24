use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[account(zero_copy)]
pub struct ZeroData {
    pub value: u64,
}

#[program]
pub mod fixture_asp012 {
    use super::*;

    pub fn load(ctx: Context<Load>) -> Result<()> {
        let data = ctx.accounts.data.load()?;
        let _ = data.value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Load<'info> {
    pub data: AccountLoader<'info, ZeroData>,
}
