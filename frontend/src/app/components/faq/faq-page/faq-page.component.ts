import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { FaqSectionComponent, FaqCategory } from '../faq-section/faq-section.component';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, FaqSectionComponent],
  templateUrl: './faq-page.component.html',
})
export class FaqPageComponent {
  categories: FaqCategory[] = [];

  constructor(private readonly transloco: TranslocoService) {
    this.categories = [
      {
        title: this.t('faq.orderingTitle'),
        items: [
          { question: this.t('faq.q_createAccount'), answer: this.t('faq.a_createAccount') },
          { question: this.t('faq.q_payment'), answer: this.t('faq.a_payment') },
          { question: this.t('faq.q_cancelOrder'), answer: this.t('faq.a_cancelOrder') },
        ],
      },
      {
        title: this.t('faq.shippingTitle'),
        items: [
          { question: this.t('faq.q_whereShip'), answer: this.t('faq.a_whereShip') },
          { question: this.t('faq.q_shippingCost'), answer: this.t('faq.a_shippingCost') },
          { question: this.t('faq.q_deliveryTime'), answer: this.t('faq.a_deliveryTime') },
          { question: this.t('faq.q_tracking'), answer: this.t('faq.a_tracking') },
        ],
      },
      {
        title: this.t('faq.returnsTitle'),
        items: [
          { question: this.t('faq.q_returnPolicy'), answer: this.t('faq.a_returnPolicy') },
          { question: this.t('faq.q_startReturn'), answer: this.t('faq.a_startReturn') },
          { question: this.t('faq.q_refundTime'), answer: this.t('faq.a_refundTime') },
        ],
      },
      {
        title: this.t('faq.productsTitle'),
        items: [
          { question: this.t('faq.q_warranty'), answer: this.t('faq.a_warranty') },
          { question: this.t('faq.q_sleepingBag'), answer: this.t('faq.a_sleepingBag') },
          { question: this.t('faq.q_crampons'), answer: this.t('faq.a_crampons') },
          { question: this.t('faq.q_stormshield'), answer: this.t('faq.a_stormshield') },
          { question: this.t('faq.q_waterFilter'), answer: this.t('faq.a_waterFilter') },
        ],
      },
      {
        title: this.t('faq.supportTitle'),
        items: [
          { question: this.t('faq.q_contact'), answer: this.t('faq.a_contact') },
          { question: this.t('faq.q_stores'), answer: this.t('faq.a_stores') },
        ],
      },
    ];
  }

  private t(key: string): string {
    return this.transloco.translate(key);
  }
}
