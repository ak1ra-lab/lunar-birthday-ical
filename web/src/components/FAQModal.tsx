import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card className='w-full max-w-2xl max-h-[80vh] overflow-y-auto relative bg-white shadow-lg'>
        <Button variant='ghost' size='icon' className='absolute right-2 top-2' onClick={onClose}>
          <X className='h-4 w-4' />
        </Button>
        <CardHeader>
          <CardTitle>{t('faq.title')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <h3 className='font-semibold text-lg'>{t('faq.whatIsICal.title')}</h3>
            <p className='text-muted-foreground'>{t('faq.whatIsICal.content')}</p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-lg'>{t('faq.howToUse.title')}</h3>
            <p className='text-muted-foreground'>{t('faq.howToUse.content')}</p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-lg'>{t('faq.subscription.title')}</h3>
            <p className='text-muted-foreground'>{t('faq.subscription.content')}</p>
          </div>

          <div className='space-y-2'>
            <h3 className='font-semibold text-lg'>{t('faq.importAdvice.title')}</h3>
            <p className='text-muted-foreground'>{t('faq.importAdvice.content')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
