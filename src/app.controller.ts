import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Stripe } from 'stripe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('payment')
  async createPayment(@Body() data: { sum: number }) {
    const stripe = new Stripe(
      'sk_test_51PICnDRrodiK0hZ42ViGQjGmxqNL725FKtkZPsBSuvmAKkRe2Jw27Sr0ZHAD2yGZACHl5VT9qnCXLUlctksmw8dr00hzKb6I5g',
    );

    const session = await stripe.checkout.sessions.create({
      expand: ['line_items'],
      payment_method_types: ['card'],
      success_url: `${process.env.CLIENT_APP}/cart?success=true`,
      cancel_url: `${process.env.CLIENT_APP}/cart`,

      line_items: [
        {
          price_data: {
            currency: 'byn',
            unit_amount: data.sum * 100,
            product_data: {
              name: 'ORDER',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    return session;
  }
}
