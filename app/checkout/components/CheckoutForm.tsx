"use client";

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping', icon: 'TruckIcon' },
    { id: 2, name: 'Payment', icon: 'CreditCardIcon' },
    { id: 3, name: 'Review', icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Icon name="CheckIcon" size={24} />
                ) : (
                  <Icon name={step.icon as any} size={24} />
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-px flex-1 mx-4 transition-colors ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleStepSubmit} className="space-y-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <h3 className="text-xl font-serif font-semibold text-foreground mt-8">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">Payment Information</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  placeholder="123"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Name on Card *
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card"
              />
            </div>

            {/* Payment Icons */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm text-muted-foreground">We accept:</span>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                  <div
                    key={method}
                    className="w-12 h-8 bg-secondary rounded border border-border flex items-center justify-center text-xs font-bold text-muted-foreground"
                  >
                    {method.slice(0, 2)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">Review Your Order</h2>
            <div className="bg-secondary p-6 rounded-xl space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium text-foreground">{formData.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium text-foreground">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Shipping to</p>
                  <p className="font-medium text-foreground">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-foreground">{formData.address}</p>
                  <p className="text-foreground">
                    {formData.city}, {formData.zipCode}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Payment</p>
                  <p className="font-medium text-foreground">
                    •••• {formData.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-8 py-3 border-2 border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Back
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-md hover:shadow-lg"
          >
            {currentStep === 3 ? 'Place Order' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}