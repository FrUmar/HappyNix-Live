import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Amex, Visa, Diners, Jcb, Maestro, Mastercard, Unionpay, amex_single, visa_single, diners_single, discover_single, jcb_single, maestro_single, mastercard_single, unionpay_single, Discover } from '../../../models/cardstype';
import { CardIconComponent } from "./card-icon.component";

interface CardTypeConfig {
  icon: string;
  singleIcon: string;
  color: string;
}

const CARD_CONFIG: { [key: string]: CardTypeConfig } = {
  'american express': { icon: amex_single, singleIcon: amex_single, color: 'green' },
  'visa': { icon: visa_single, singleIcon: visa_single, color: 'lime' },
  'diners': { icon: diners_single, singleIcon: diners_single, color: 'orange' },
  'discover': { icon: discover_single, singleIcon: discover_single, color: 'purple' },
  'jcb': { icon: jcb_single, singleIcon: jcb_single, color: 'red' },
  'jcb15': { icon: Jcb, singleIcon: jcb_single, color: 'red' },
  'maestro': { icon: Maestro, singleIcon: maestro_single, color: 'yellow' },
  'mastercard': { icon: Mastercard, singleIcon: mastercard_single, color: 'lightblue' },
  'unionpay': { icon: Unionpay, singleIcon: unionpay_single, color: 'cyan' },
  'Unknown': { icon: 'green', singleIcon: '', color: 'grey' }
};

// Card detection regexes, separated for clarity
const CARD_TYPE_REGEX: { type: string, regex: RegExp }[] = [
  { type: 'american express', regex: /^3[47]\d{0,13}/ },
  { type: 'discover', regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/ },
  { type: 'diners', regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/ },
  { type: 'mastercard', regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/ },
  { type: 'jcb15', regex: /^(?:2131|1800)\d{0,11}/ },
  { type: 'jcb', regex: /^(?:35\d{0,2})\d{0,12}/ },
  { type: 'maestro', regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/ },
  { type: 'visa', regex: /^4\d{0,15}/ },
  { type: 'unionpay', regex: /^62\d{0,14}/ },
];

@Component({
  selector: 'app-credit-card',
  imports: [CommonModule, ReactiveFormsModule, CardIconComponent],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.scss'
})
export class CreditCardComponent implements OnInit, AfterViewInit, OnDestroy {
  public isCardFlipped: boolean = false;
  public cardColorClass: string = 'grey'; // For dynamic color swapping
  public isViewInitialized: boolean = false; // For preload class management
  creditCardForm!: FormGroup;
  // Properties to update the SVG text fields
  public svgNumber: string = '0000 0000 0000 0000';
  public svgExpire: string = '01/26';
  public svgSecurity: string = '000';
  public svgNameDisplay: string = 'Your name';
  public svgIconHtml: string = '';
  public svgSingleIconHtml: string = '';
  private formValueChangesSub!: Subscription;
  amex_single = amex_single
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
  }

  ngAfterViewInit(): void {
    // Use a property to control the 'preload' class in the template.
    // This avoids direct DOM manipulation and is a cleaner Angular approach.
    this.isViewInitialized = true;
  }

  ngOnDestroy(): void {
    this.formValueChangesSub?.unsubscribe();
  }

  private initializeForm(): void {
    this.creditCardForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      // User will type only digits, we handle formatting for display
      cardnumber: ['', [Validators.required, Validators.pattern(/^\d{13,19}$/)]],
      expirationdate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\d{2}$/)]], // MMYY
      securitycode: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  private subscribeToFormChanges(): void {
    this.formValueChangesSub = new Subscription();

    const nameControl = this.creditCardForm.get('name');
    if (nameControl) {
      this.formValueChangesSub.add(
        nameControl.valueChanges.subscribe(value => {
          this.svgNameDisplay = value && value.length > 0 ? value.toUpperCase() : 'Your Name';
        })
      );
    }

    const cardNumberControl = this.creditCardForm.get('cardnumber');
    if (cardNumberControl) {
      this.formValueChangesSub.add(
        cardNumberControl.valueChanges.subscribe(value => {
          this.updateCardVisuals(value || '');
        })
      );
    }

    const expirationDateControl = this.creditCardForm.get('expirationdate');
    if (expirationDateControl) {
      this.formValueChangesSub.add(
        expirationDateControl.valueChanges.subscribe(value => {
          const cleanValue = (value || '').replace(/\D/g, '');
          let formatted = cleanValue;
          if (cleanValue.length > 2) {
            formatted = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
          }
          this.svgExpire = formatted.length > 0 ? formatted : '01/23';
        })
      );
    }

    const securityCodeControl = this.creditCardForm.get('securitycode');
    if (securityCodeControl) {
      this.formValueChangesSub.add(
        securityCodeControl.valueChanges.subscribe(value => {
          this.svgSecurity = (value || '').length > 0 ? value : '985';
        })
      );
    }
  }

  // ------------------------------------------------------------------
  // --- Core Logic Functions ---
  // ------------------------------------------------------------------

  get name() { return this.creditCardForm.get('name'); }
  get cardnumber() { return this.creditCardForm.get('cardnumber'); }
  get expirationdate() { return this.creditCardForm.get('expirationdate'); }
  get securitycode() { return this.creditCardForm.get('securitycode'); }

  private updateCardVisuals(cardNumber: string): void {
    const unformattedValue = cardNumber.replace(/\D/g, '');
    const cardType = this.detectCardType(unformattedValue);

    this.svgNumber = this.formatCardNumberForSvg(unformattedValue, cardType);

    // Update icons and color using the configuration object.
    // This is cleaner and more maintainable than a large switch statement.
    const config = CARD_CONFIG[cardType];
    if (config) {
      this.svgIconHtml = config.icon;
      this.svgSingleIconHtml = config.singleIcon;
      this.swapColor(config.color);
    }
  }

  private detectCardType(cardNumber: string): string {
    for (const card of CARD_TYPE_REGEX) {
      if (cardNumber.match(card.regex)) {
        // jcb15 is a subset of jcb, handle it
        return card.type === 'jcb15' ? 'jcb' : card.type;
      }
    }
    return 'Unknown';
  }

  private formatCardNumberForSvg(cardNumber: string, cardType: string): string {
    const defaultNumber = '0123456789101112';
    const padded = (cardNumber + defaultNumber).substring(0, 16);

    if (cardType === 'american express') {
      const amexPadded = (cardNumber + defaultNumber.substring(0, 15)).substring(0, 15);
      return amexPadded.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }

    if (cardType === 'diners') {
      const dinersPadded = (cardNumber + defaultNumber.substring(0, 14)).substring(0, 14);
      return dinersPadded.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3');
    }

    // Default to 4-4-4-4 for Visa, Mastercard, etc.
    return padded.replace(/(\d{4})/g, '$1 ').trim();
  }

  private swapColor(basecolor: string): void {
    // We use a single component property (cardColorClass) to drive all color changes
    // via CSS classes, which is more "Angular" than direct DOM manipulation.
    this.cardColorClass = basecolor;
  }

  // ------------------------------------------------------------------
  // --- UI and Utility Functions ---
  // ------------------------------------------------------------------

  public flipCard(flip: boolean): void {
    this.isCardFlipped = flip;
  }

  public toggleFlipCard(): void {
    this.isCardFlipped = !this.isCardFlipped;
  }

  public generateRandomCard(): void {
    const testCards: string[] = [
      '4000056655665556', // Visa
      '5200828282828210', // Mastercard
      '371449635398431', // Amex
      '6011000990139424', // Discover
      '30569309025904', // Diners
      '3566002020360505', // JCB
      '6200000000000005', // UnionPay
      '6759649826438453', // Maestro
    ];
    const randomNumber = Math.floor(Math.random() * testCards.length);
    this.cardnumber?.setValue(testCards[randomNumber]);
  }
}
