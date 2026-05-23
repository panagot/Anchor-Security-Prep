use anchor_lang::prelude::*;

declare_id!("Fix11111111111111111111111111111111111111");

#[program]
pub mod fixture_asp006 {
    use super::*;

    pub fn cpi_call(ctx: Context<CpiCall>) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: ctx.accounts.external.key(),
            accounts: vec![],
            data: vec![],
        };
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[ctx.accounts.external.to_account_info()],
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CpiCall<'info> {
    pub external: AccountInfo<'info>,
}
