export interface VideoAdTemplate {
  id: string;
  title: string;
  category:
    | 'spices'
    | 'grocery'
    | 'cooking'
    | 'farm_fresh'
    | 'dairy'
    | 'oils'
    | 'festive_sale'
    | 'express_delivery'
    | 'dry_fruits';
  categoryLabel: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  badge: string;
  suggestedTitle: string;
  suggestedDailyBudget: number;
  suggestedRadiusKm: number;
  suggestedDurationDays: number;
  callToAction: string;
  tags: string[];
  recommendedFor: string;
}
