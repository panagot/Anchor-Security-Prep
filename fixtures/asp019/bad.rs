use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;

declare_id!("Fix19191919191919191919191919191919191919");

#[program]
pub mod fixture_asp019 {
    use super::*;
    pub fn signed_cpi(ctx: Context<SignedCpiBad>) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: ctx.accounts.program.key(),
            accounts: vec![],
            data: vec![],
        };
        invoke_signed(&ix, &[ctx.accounts.program.to_account_info()], &[&[]])?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SignedCpiBad<'info> {
    pub program: AccountInfo<'info>,
}
