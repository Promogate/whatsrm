import { generateNanoID } from "@/infrastructure/config/Nanoid";

interface ContactProps {
  id: string;
  whatsappId: string;
  name: string;
  phone: string;
  type: 'lead' | 'client' | 'prospect';
  tags: string[];
  status: 'active' | 'inactive' | 'negotiating';
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}

interface CreateContactProps {
  whatsappId: string;
  name: string;
  phone: string;
  type: 'lead' | 'client' | 'prospect';
  tags?: string[];
  customerId: string;
}

export class Contact {
  private readonly id: string;
  private whatsappId: string;
  private name: string;
  private phone: string;
  private type: 'lead' | 'client' | 'prospect';
  private tags: string[];
  private status: 'active' | 'inactive' | 'negotiating';
  private readonly createdAt: Date;
  private updatedAt: Date;
  private readonly customerId: string;

  private constructor(props: ContactProps) {
    this.id = props.id;
    this.whatsappId = props.whatsappId;
    this.name = props.name;
    this.phone = props.phone;
    this.type = props.type;
    this.tags = props.tags;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.customerId = props.customerId;

    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error('Contact name must be at least 2 characters long');
    }

    if (!this.whatsappId) {
      throw new Error('WhatsApp ID is required');
    }

    if (!this.phone || !this.validatePhone(this.phone)) {
      throw new Error('Invalid phone format');
    }

    if (!this.customerId) {
      throw new Error('Customer ID is required');
    }

    if (!Array.isArray(this.tags)) {
      throw new Error('Tags must be an array');
    }
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }

  public static create(props: CreateContactProps): Contact {
    const now = new Date();

    const contactProps: ContactProps = {
      id: generateNanoID(),
      whatsappId: props.whatsappId,
      name: props.name,
      phone: props.phone,
      type: props.type,
      tags: props.tags || [],
      status: 'active',
      createdAt: now,
      updatedAt: now,
      customerId: props.customerId
    };

    return new Contact(contactProps);
  }

  public static reconstitute(props: ContactProps): Contact {
    return new Contact(props);
  }

  public updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
    this.validate();
  }

  public updatePhone(phone: string): void {
    this.phone = phone;
    this.updatedAt = new Date();
    this.validate();
  }

  public updateType(type: 'lead' | 'client' | 'prospect'): void {
    this.type = type;
    this.updatedAt = new Date();
  }

  public updateStatus(status: 'active' | 'inactive' | 'negotiating'): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  public addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  public removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date();
  }

  public getId(): string {
    return this.id;
  }

  public getWhatsappId(): string {
    return this.whatsappId;
  }

  public getName(): string {
    return this.name;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getType(): 'lead' | 'client' | 'prospect' {
    return this.type;
  }

  public getTags(): string[] {
    return [...this.tags];
  }

  public getStatus(): 'active' | 'inactive' | 'negotiating' {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public toJSON() {
    return {
      id: this.id,
      whatsappId: this.whatsappId,
      name: this.name,
      phone: this.phone,
      type: this.type,
      tags: [...this.tags],
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      customerId: this.customerId
    };
  }

  public equals(other: Contact): boolean {
    if (!(other instanceof Contact)) return false;
    return this.id === other.id;
  }
}