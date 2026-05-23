use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

pub struct RawState {
    pub value: u64,
}

#[derive(Accounts)]
pub struct UseRaw<'info> {
    pub state: Account<'info, RawState>,
}
