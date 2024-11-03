import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateNextId } from 'src/shared/shared';
import { PaymentStatus } from './enum/payment-status.enum';
import { ProductService } from 'src/product/product.service';
import { OrderProduct } from './entities/order-product.entity';
import { IProductInfo } from './interface/products.interface';

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order)
  private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly productService: ProductService) { }

  async create(createOrderDto: CreateOrderDto, loggedUser) {
    try {
      let order = await this.findLast({ shopId: loggedUser.shopId });
      createOrderDto.orderId = generateNextId("ORDER", order?.[0]?.orderId);

      for (let product of createOrderDto.products) {
        await this.productService.findOneByOrFail({ id: product.id, shopId: loggedUser.shopId });
      }
      createOrderDto.shopId = loggedUser.shopId;
      createOrderDto.createdBy = loggedUser.id;

      createOrderDto.paymentStatus = PaymentStatus.PENDING;

      let placedOrder = await this.orderRepository.save(createOrderDto);

      createOrderDto.products.forEach(async (product:IProductInfo) => {
        let orderProduct: Partial<OrderProduct> = {
          productId: product.id, price: product.price,
          orderId: placedOrder.id, createdBy: loggedUser.id
        }
        await this.orderProductRepository.save(orderProduct);
      })

      return "order is placed";

    }
    catch (err) {
      throw { message: err.message || "Error in creating order", statusCode: err.statusCode || 500 }
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async findOneBy(where: Partial<Order>) {
    return await this.orderRepository.findOneBy(where);
  }

  async findOneByOrFail(where: Partial<Order>) {
    try {
      return await this.orderRepository.findOneByOrFail(where);
    } catch (err) {
      throw { message: "Order not present", statusCode: 404 };
    }
  }

  async findLast(where) {
    try {
      return await this.orderRepository.find({
        where,
        order: {
          id: 'DESC'
        },
        take: 1
      });
    } catch (err) {
      throw { message: err, statusCode: 500 };
    }
  }

}
