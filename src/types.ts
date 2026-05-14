/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Profile {
  userId: string;
  name: string;
  photo: string;
  occupations: string[];
  department: string;
  city: string;
  experience: number;
  description: string;
  priceRange: 'Economic' | 'Standard' | 'Premium';
  phone: string;
  rating: number;
  ratingCount: number;
  isWorker: boolean;
  portfolio?: string[];
  createdAt: any;
  updatedAt: any;
}

export interface Review {
  id?: string;
  workerId: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export type ViewState = 'HOME' | 'SEARCH' | 'PROFILE' | 'EDIT_PROFILE' | 'LOGIN';
