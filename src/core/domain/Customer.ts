import bcrypt from 'bcrypt';

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerProps {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export class Customer {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private phone: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(props: CustomerProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.phone = props.phone || null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Customer name must be at least 2 characters long');
    }

    if (!this.email || !this.validateEmail(this.email)) {
      throw new Error('Invalid email format');
    }

    if (this.phone && !this.validatePhone(this.phone)) {
      throw new Error('Invalid phone format');
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  public static create(props: CreateCustomerProps): Customer {
    const now = new Date();
    const encryptedPassword = bcrypt.hashSync(props.password, 10)

    const customerProps: CustomerProps = {
      id: crypto.randomUUID(),
      name: props.name,
      email: props.email,
      password: encryptedPassword,
      phone: props.phone,
      createdAt: now,
      updatedAt: now
    };

    return new Customer(customerProps);
  }

  public static reconstitute(props: CustomerProps): Customer {
    return new Customer(props);
  }

  public updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
    this.validate();
  }

  public updateEmail(email: string): void {
    this.email = email;
    this.updatedAt = new Date();
    this.validate();
  }

  public updatePhone(phone: string | null): void {
    this.phone = phone;
    this.updatedAt = new Date();
    this.validate();
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getPhone(): string | null {
    return this.phone;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public equals(other: Customer): boolean {
    if (!(other instanceof Customer)) return false;
    return this.id === other.id;
  }
}