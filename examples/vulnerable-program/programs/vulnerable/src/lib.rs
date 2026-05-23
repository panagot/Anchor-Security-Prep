use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::token_interface::{Token2022, TokenAccount as Token2022Account};

declare_id!("VULN1111111111111111111111111111111111111");

#[program]
pub mod vulnerable {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.amount = amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.amount = vault.amount.checked_sub(amount).unwrap();
        Ok(())
    }

    pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token.to_account_info(),
            to: ctx.accounts.to_token.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts);
        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn close_vault(ctx: Context<CloseVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        **ctx.accounts.destination.lamports.borrow_mut() += vault.to_account_info().lamports();
        vault.to_account_info().assign(&system_program::ID);
        vault.to_account_info().realloc(0, false)?;
        Ok(())
    }

    pub fn read_sysvar(ctx: Context<ReadSysvar>) -> Result<()> {
        let _rent = Rent::from_account_info(&ctx.accounts.rent_sysvar)?;
        Ok(())
    }

    pub fn set_admin(ctx: Context<SetAdmin>, new_admin: Pubkey) -> Result<()> {
        ctx.accounts.config.admin = new_admin;
        Ok(())
    }

    pub fn invoke_external(ctx: Context<InvokeExternal>) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: ctx.accounts.target_program.key(),
            accounts: vec![],
            data: vec![],
        };
        anchor_lang::solana_program::program::invoke_signed(
            &ix,
            &[ctx.accounts.target_program.to_account_info()],
            &[],
        )?;
        Ok(())
    }

    pub fn process_remaining(ctx: Context<ProcessRemaining>) -> Result<()> {
        for acc in ctx.remaining_accounts.iter() {
            let _key = acc.key();
        }
        Ok(())
    }

    pub fn batch_update(ctx: Context<BatchUpdate>, amounts: Vec<u64>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        for a in amounts.iter() {
            vault.amount += a;
        }
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.balance += amount;
        Ok(())
    }

    pub fn reset_config(ctx: Context<ResetConfig>) -> Result<()> {
        ctx.accounts.config.admin = Pubkey::default();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", payer.key().as_ref()],
    )]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub user: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    pub from_token: Account<'info, TokenAccount>,
    pub to_token: Account<'info, TokenAccount>,
    pub authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub destination: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ReadSysvar<'info> {
    pub rent_sysvar: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetAdmin<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    pub caller: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct InvokeExternal<'info> {
    pub target_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ProcessRemaining<'info> {
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct BatchUpdate<'info> {
    #[account(mut)]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub vault: Account<'info, BalanceVault>,
}

#[derive(Accounts)]
pub struct ResetConfig<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
}

pub struct BalanceVault {
    pub balance: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
}

#[derive(Accounts)]
pub struct InitIfNeededExample<'info> {
    #[account(init_if_needed, payer = payer, space = 8)]
    pub data: Account<'info, Vault>,
    #[account(mut)]
    pub payer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VecExample<'info> {
    pub items: Vec<Account<'info, Vault>>,
}

#[derive(Accounts)]
pub struct Token2022Transfer<'info> {
    pub mint: InterfaceAccount<'info, anchor_spl::token_interface::Mint>,
    pub from: InterfaceAccount<'info, Token2022Account>,
    pub token_program: Interface<'info, Token2022>,
}

#[derive(Accounts)]
pub struct AtaExample<'info> {
    pub associated_token: Account<'info, TokenAccount>,
    pub wallet: AccountInfo<'info>,
}
