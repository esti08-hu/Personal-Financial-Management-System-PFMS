// src/transaction/transaction.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/guards/auth.decorators";
import {
  CreateTransactionDto,
  DeleteTransactionDto,
  UpdateTransactionDto,
} from "./transaction.dto";
import { TransactionService } from "./transaction.service";

@Controller("transaction")
@ApiTags("transaction")
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get("top-users")
  async getTopUser() {
    return await this.transactionService.getTopUsersByTransactionCount();
  }
  @Get("count")
  async getTransactionCount() {
    return await this.transactionService.getTransactionsCount();
  }
  @Get(":id")
  async getTransactionById(@Param("id") id: number) {
    return await this.transactionService.getTransactionById(id);
  }

  @Get("income/:id")
  @Public()
  async getIncome(@Param("id") userId: number) {
    return await this.transactionService.getIncome(userId);
  }
  @Get("expense/:id")
  async getExpense(@Param("id") userId: number) {
    return await this.transactionService.getExpense(userId);
  }

  @Get("count/:id")
  @Public()
  async getUserTransactionCount(@Param("id") id: number) {
    return await this.transactionService.getUserTransactionsCount(id);
  }
  @Get("recent/:id")
  @Public()
  async getResent(@Param("id") userId: number) {
    return this.transactionService.getResentTransactions(userId);
  }

  @Get("user/:id")
  @Public()
  async getUserTransactions(@Param("id") userId: number) {
    return this.transactionService.getUserTransactions(userId);
  }

  @Post("add-transaction")
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const result =
      await this.transactionService.createTransaction(createTransactionDto);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    await this.transactionService.updateTransaction(
      Number(id),
      updateTransactionDto
    );
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Body() data: DeleteTransactionDto) {
    return await this.transactionService.deleteTransaction(data, Number(id));
  }
}
