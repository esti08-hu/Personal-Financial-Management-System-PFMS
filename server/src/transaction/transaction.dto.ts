import { Transform } from 'class-transformer'
import { IsNumber, IsString } from 'class-validator'

export class CreateTransactionDto {
  @IsNumber()
  userId: number
  @IsNumber()
  balance: number
  @IsNumber()
  accountId: number
  @IsString()
  type: string
  @IsNumber()
  amount: number
  @IsString()
  createdAt: string
  @IsString()
  description: string
}

export class UpdateTransactionDto {
  @IsString()
  type: string

  @Transform(({ value }) => Number(value))
  @IsNumber()
  accountId: number

  @Transform(({ value }) => Number(value))
  @IsNumber()
  amount: number

  @IsString()
  createdAt: string
  
  @IsString()
  description: string
  
  @Transform(({ value }) => Number(value))
  @IsNumber()
  balance: number
}

export class DeleteTransactionDto {
  @IsNumber()
  balance: number
  @IsNumber()
  accountId: number
}
