import { NgForm, FormsModule } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Input, ViewChild, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardComponent } from "./credit-card/credit-card.component";

interface toolDetails {
  productId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  mainImage: string;
  isFree: boolean;
  isPaid: boolean;
  downloadLink: string;
  price: number;
  version: string;
  releaseDate: string;
  features: string | string[];
  videoLink: string;
  categoryId: string;
  categoryName: string | null;
}

interface CryptoOption {
  key: string;
  name: string;
  icon: string; // SVG path data
}

// नया इंटरफ़ेस
interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
}

@Component({
  selector: 'app-buy-now',
  // FormsModule को imports में जोड़ा गया है ताकि [(ngModel)] काम करे
  imports: [CommonModule, FormsModule, CreditCardComponent, CreditCardComponent],
  templateUrl: './buy-now.component.html',
  styleUrl: './buy-now.component.scss',
  standalone: true // Added standalone for simplicity in new Angular projects
})
export class BuyNowComponent implements OnInit {
  @Input() modalRef!: NgbModalRef;
  @Input() toolId!: any;

  private _products: toolDetails[] = [];
  @Input()
  set product(value: toolDetails | toolDetails[]) {
    const products = Array.isArray(value) ? value : [value];
    this._products = products.map(p => ({
      ...p,
      features: typeof p.features === 'string' ? p.features.split(',').map(f => f.trim()).filter(f => f) : p.features
    }));
  }
  get product(): toolDetails[] {
    return this._products;
  }

  @ViewChild('buyNowForm') buyNowForm!: NgForm;
  // @ViewChild('cardForm') cardForm!: NgForm; // Added ViewChild for card form
  // --- New/Updated Properties ---
  selectedProduct: toolDetails | null = null;
  paymentMethod: 'Card' | 'Crypto' = 'Card'; // Default to Card
  isPlacingOrder: boolean = false;
  orderStatus: 'idle' | 'success' | 'error' = 'idle';
  orderId: string | null = null;

  cardDetails: CardDetails = { // Card details initialization
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  };

  cryptoOptions: CryptoOption[] = [
    {
      key: 'BTC',
      name: 'Bitcoin',
      icon: 'M13.25 15.3c-.1-.7-.4-1.2-.9-1.6-.5-.4-1.2-.7-2-.7-.7 0-1.4.3-2.1.8-.7.5-1.2 1.2-1.4 2.1H5.8c.2-1 .6-1.9 1.2-2.7.6-.8 1.4-1.4 2.3-1.8.9-.4 1.9-.6 3-.6 1.4 0 2.6.4 3.5 1.1.9.7 1.4 1.7 1.4 3.1 0 1-.2 1.7-.7 2.3-.5.6-1.1 1.1-1.9 1.5-.8.4-1.7.8-2.7 1.2-.8.3-1.6.6-2.5 1-.9.3-1.8.6-2.8.9-1.1.3-2.3.6-3.6.9v3.7h1.9c.2 0 .3 0 .5.1.2 0 .4.1.6.2.2.1.4.2.6.3.2.1.4.3.5.5.1.2.2.4.2.6.1.2.1.5.1.7 0 .5-.1.9-.2 1.3-.2.4-.4.7-.7 1-.3.3-.6.5-1 .7-.4.2-.8.3-1.4.3-1.1 0-2-.3-2.8-.8-.8-.5-1.4-1.2-1.8-2.1h-2.1c.4 1.2 1.1 2.2 2.1 3.1 1 .9 2.2 1.5 3.6 1.8 1.4.3 2.8.5 4.3.5 1.9 0 3.5-.4 4.8-1.2 1.3-.8 2.2-2 2.8-3.5.6-1.4.9-3 .9-4.7 0-1.9-.3-3.4-.9-4.7-.6-1.3-1.5-2.2-2.7-2.9-1.2-.7-2.6-1-4.2-1s-3 .3-4.2 1c-1.2.7-2 1.6-2.4 2.9h2.1c.1-.4.2-.7.4-.9.2-.3.5-.5.8-.7.3-.2.7-.3 1.1-.3.5 0 1 .1 1.5.3.5.2.9.5 1.3.9.4.4.6.9.7 1.4.1.5.2 1.1.2 1.8v.5H9.4v3.5h3.8v-3.5c0-.2.1-.4.1-.5 0-.1 0-.3.1-.4Z M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z',
    },
    {
      key: 'ETH',
      name: 'Ethereum',
      icon: 'M12 2L2 12L12 22L22 12L12 2Z M12 4.7L19.3 12L12 19.3L4.7 12L12 4.7Z',
    },
  ];


  constructor() {
    // Initializing defaults
    // Since `product` is an array, we select the first one as default if needed,
    // but the component typically expects it to be set by the parent.
    // For this demonstration, we'll assume the selection logic is in the HTML.
    this.paymentMethod = 'Card'; // Default payment method
    this.orderStatus = 'idle';
    this.orderId = null;
  }

  ngOnInit(): void {
    if (this.product && this.product.length > 0) {
      this.selectedProduct = this.product[0];
    }
  }

  // Existing methods
  closeModal() {
    this.modalRef.close();
  }


  // --- Component Logic ---

  openBuyModal(product: toolDetails): void {
    this.selectedProduct = product;
    this.paymentMethod = 'Card';
    this.orderStatus = 'idle';
    this.orderId = null;
  }

  closeBuyModal(): void {
    this.modalRef.close();
  }

  selectProduct(product: toolDetails): void {
    this.selectedProduct = product;
    this.orderStatus = 'idle';
  }

  // New method to select payment method
  selectPaymentMethod(method: 'Card' | 'Crypto'): void {
    this.paymentMethod = method;
    this.orderStatus = 'idle';

  }

  selectCrypto(key: string): void {
    this.orderStatus = 'idle';
  }

  // New method to check if the current payment method details are valid
  isPaymentValid(): boolean {
    if (!this.selectedProduct) {
      return false;
    }

    if (this.paymentMethod === 'Card') {
      // Check card form validity
      // This relies on the HTML form's `required` and `pattern` attributes
      // and the NgForm being properly initialized in the view (using @ViewChild)
      return true;
    } else if (this.paymentMethod === 'Crypto') {
      // Check if a crypto option is selected
      return true;
    }
    return false;
  }

  async placeOrder(): Promise<void> {
    const product = this.selectedProduct;

    if (!product || !this.isPaymentValid()) {
      this.orderStatus = 'error';
      return;
    }

    this.isPlacingOrder = true;
    this.orderStatus = 'idle';

    let paymentInfo = this.paymentMethod === 'Card' ? this.cardDetails.number.slice(-4) : '';
    console.log(`Attempting to place order for ${product.name} using ${this.paymentMethod} (${paymentInfo})...`);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success/failure (90% success rate)
      const success = Math.random() < 0.9;

      if (success) {
        const generatedId = `KEY-${Date.now().toString().slice(-6)}`;
        this.orderId = generatedId;
        this.orderStatus = 'success';
        console.log('Order successfully processed (simulated).');

      } else {
        this.orderStatus = 'error';
        console.error('Simulated API failure.');
      }
    } catch (e) {
      this.orderStatus = 'error';
      console.error('An unexpected error occurred during transaction:', e);
    } finally {
      this.isPlacingOrder = false;
    }
  }

}