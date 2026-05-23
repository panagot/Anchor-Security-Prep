use anchor_lang::prelude::*;

declare_id!("Fix44444444444444444444444444444444444444");

#[program]
pub mod fixture_asp004 {
    use super::*;
    pub fn close(ctx: Context<CloseBad>) -> Result<()> {
        let acct = &mut ctx.accounts.target;
        **ctx.accounts.dest.to_account_info().try_borrow_mut_lamports()? += acct.to_account_info().lamports();
        acct.to_account_info().assign(&system_program::ID);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CloseBad<'info> {
    #[account(mut)]
    pub target: Account<'info, Data>,
    /// CHECK: manual close
    pub dest: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Data {
    pub value: u64,
}
