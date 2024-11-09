import { describe, expect, it, vi } from 'vitest';
import { getExchangeRate } from '../src/libs/currency';
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';

vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    const greet = vi.fn();
    // greet.mockReturnValue('hello');
    // greet.mockResolvedValue('hello promise')
    greet.mockImplementation((name) => 'hello ' + name);
    // const result = greet().then((res) => console.log(res)
    // );
    greet('Mona');
    // console.log(res);
    expect(greet).toHaveBeenCalled();
  });
});

describe('exercise', () => {
  it('should mock the function sendText', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');
    const res = sendText('message');
    expect(sendText).toHaveBeenCalledWith('message');
    expect(res).toBe('ok');
  });
});

describe('getPriceCurrency', () => {
  it('should return price according to currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');
    expect(price).toBe(15);
  });
});

describe('getShippingInfo', () => {
  it('should return shipping cost according to destination', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 20, estimatedDays: 2 });
    const result = getShippingInfo('Fairfield');
    expect(result).toMatch(/shipping cost: \$20 \(2 days\)/i);
  });
  it('should return unavailable when the quote is not found', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('Connecticut');
    expect(result).toMatch(/unavailable/i);
  });
});

describe('renderPage', () => {
  it('should call analytics', async () => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });
});

describe('submitOrder', () => {
  const order = { totalAmount: 120 };
  const creditCard = '1234';
  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    await submitOrder(order, creditCard);
    expect(charge).toBeCalledWith(creditCard, order.totalAmount);
  });
  it('should return error obj when the payment is unsuccessful', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'failed' });
    const result = await submitOrder(order, creditCard);
    expect(charge).toBeCalledWith(creditCard, order.totalAmount);
    expect(result).toEqual({ success: false, error: 'payment_error' });
  });
  it('should submit order successfully', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' });
    const result = await submitOrder(order, creditCard);
    expect(charge).toBeCalledWith(creditCard, order.totalAmount);
    expect(result).toEqual({ success: true });
  });
});

describe('signUp', () => {
  const email = 'name@gmail.com';
  // beforeEach(() => {
  //     vi.clearAllMocks();
  // })
  it('should return false if the email is invalid', async () => {
    const result = await signUp('e');
    expect(result).toBe(false);
  });
  it('should return true if the email is valid', async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });
  it('should send the welcome email if email is valid', async () => {
    await signUp(email);
    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe('login', () => {
  it('should email the one-time login code', async () => {
    const email = 'name@gmail.com';
    const spy = vi.spyOn(security, 'generateCode');
    await login(email);
    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if the current hour is outside the opening hours', () => {
    vi.setSystemTime('2024-11-09 07:59');
    expect(isOnline()).toBe(false);

    vi.setSystemTime('2024-11-09 20:01');
    expect(isOnline()).toBe(false);
  });

  it('should return true if the current hour is within the opening hours', () => {
    vi.setSystemTime('2024-11-09 08:00');
    expect(isOnline()).toBe(true);

    vi.setSystemTime('2024-11-09 19:59');
    expect(isOnline()).toBe(true);
  });
});

describe('getDiscount', () => {
  it('should return 0.2 if current date is Christmas date', () => {
    vi.setSystemTime('2024-12-25 00:01');
    expect(getDiscount()).toBe(0.2);
  });
  it('should return 0 if current date is not Christmas date', () => {
    vi.setSystemTime('2024-12-26 00:01');
    expect(getDiscount()).toBe(0);
  });
  it('should return 0.2 if current date is Christmas date', () => {
    vi.setSystemTime('2024-12-25 23:59');
    expect(getDiscount()).toBe(0.2);
  });
  it('should return 0 if current date is not Christmas date', () => {
    vi.setSystemTime('2024-12-24 00:01');
    expect(getDiscount()).toBe(0);
  });
});
