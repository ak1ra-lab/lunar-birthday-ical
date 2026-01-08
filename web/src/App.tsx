import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { Download, HelpCircle, Languages, RotateCcw, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfigForm } from '@/components/ConfigForm';
import { EventForm } from '@/components/EventForm';
import { EventList } from '@/components/EventList';
import { FAQModal } from '@/components/FAQModal';
import { GithubIcon } from '@/components/icons';
import { ObservanceForm } from '@/components/ObservanceForm';
import { ObservanceList } from '@/components/ObservanceList';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateICal } from '@/lib/ical';
import { AppConfig, DEFAULT_CONFIG, EventConfig, GlobalConfig, ObservanceConfig } from '@/types';

function App() {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('lunar-birthday-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure observances exists if loading old config
      if (!parsed.observances) {
        parsed.observances = DEFAULT_CONFIG.observances;
      }
      return parsed;
    }
    return DEFAULT_CONFIG;
  });

  const [editingEvent, setEditingEvent] = useState<EventConfig | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [editingObservance, setEditingObservance] = useState<ObservanceConfig | null>(null);
  const [isAddingObservance, setIsAddingObservance] = useState(false);

  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [icalOutput, setIcalOutput] = useState('');

  useEffect(() => {
    localStorage.setItem('lunar-birthday-config', JSON.stringify(config));
    generateICal(config, t).then(setIcalOutput).catch(console.error);
  }, [config, t]);

  const handleGlobalSave = (global: GlobalConfig) => {
    setConfig((prev) => ({ ...prev, global }));
  };

  const handleEventSave = (event: EventConfig) => {
    setConfig((prev) => {
      const exists = prev.events.find((e) => e.id === event.id);
      if (exists) {
        return { ...prev, events: prev.events.map((e) => (e.id === event.id ? event : e)) };
      } else {
        return { ...prev, events: [...prev.events, event] };
      }
    });
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleEventDelete = (id: string) => {
    setConfig((prev) => ({ ...prev, events: prev.events.filter((e) => e.id !== id) }));
  };

  const handleObservanceSave = (observance: ObservanceConfig) => {
    setConfig((prev) => {
      const exists = prev.observances?.find((o) => o.id === observance.id);
      let newObservances = prev.observances || [];
      if (exists) {
        newObservances = newObservances.map((o) => (o.id === observance.id ? observance : o));
      } else {
        newObservances = [...newObservances, observance];
      }
      return { ...prev, observances: newObservances };
    });
    setEditingObservance(null);
    setIsAddingObservance(false);
  };

  const handleObservanceDelete = (id: string) => {
    setConfig((prev) => ({ ...prev, observances: (prev.observances || []).filter((o) => o.id !== id) }));
  };

  const handleDownload = () => {
    const blob = new Blob([icalOutput], { type: 'text/calendar;charset=utf-8' });
    const baseName = 'lunar-birthday';
    const date = format(new Date(), 'yyyy-MM-dd');
    let filename = `${date}-${baseName}.ics`;
    if (config.events.length > 0) {
      // Replace spaces with underscores
      const name = config.events[0].name.replace(/\s+/g, '_');
      filename = `${date}-${baseName}-${name}.ics`;
    }
    saveAs(blob, filename);
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    saveAs(blob, 'lunar-birthday-config.json');
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          setConfig(parsed);
        } catch {
          alert('Invalid config file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetConfig = () => {
    if (confirm(t('common.resetConfirm'))) {
      localStorage.removeItem('lunar-birthday-config');
      setConfig(DEFAULT_CONFIG);
      setEditingEvent(null);
      setIsAddingEvent(false);
      setEditingObservance(null);
      setIsAddingObservance(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-100 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <header className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex-1 min-w-0 text-center md:text-left'>
            <h1 className='text-3xl font-bold text-slate-900 whitespace-nowrap'>{t('app.title')}</h1>
            <p className='text-slate-500'>{t('app.subtitle')}</p>
          </div>
          <div className='flex flex-wrap md:flex-nowrap gap-2 items-center shrink-0 justify-center'>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9'
              onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
              title={i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <Languages className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9'
              onClick={handleExportConfig}
              title={t('common.export')}
            >
              <Save className='h-4 w-4' />
            </Button>
            <div className='relative'>
              <input
                type='file'
                accept='.json'
                onChange={handleImportConfig}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                title={t('common.import')}
              />
              <Button variant='outline' size='icon' className='h-9 w-9'>
                <Upload className='h-4 w-4' />
              </Button>
            </div>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50'
              onClick={handleResetConfig}
              title={t('common.reset')}
            >
              <RotateCcw className='h-4 w-4' />
            </Button>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            {isAddingEvent || editingEvent ? (
              <EventForm
                initialData={editingEvent || undefined}
                onSave={handleEventSave}
                onCancel={() => {
                  setIsAddingEvent(false);
                  setEditingEvent(null);
                }}
              />
            ) : isAddingObservance || editingObservance ? (
              <ObservanceForm
                initialData={editingObservance || undefined}
                onSave={handleObservanceSave}
                onCancel={() => {
                  setEditingObservance(null);
                  setIsAddingObservance(false);
                }}
              />
            ) : (
              <>
                <ConfigForm config={config.global} onSave={handleGlobalSave} />
                <EventList
                  events={config.events}
                  onEdit={setEditingEvent}
                  onDelete={handleEventDelete}
                  onAdd={() => setIsAddingEvent(true)}
                />
                <ObservanceList
                  observances={config.observances || []}
                  onEdit={setEditingObservance}
                  onDelete={handleObservanceDelete}
                  onAdd={() => setIsAddingObservance(true)}
                />
              </>
            )}
          </div>

          <div className='space-y-6'>
            <div className='bg-white p-4 rounded-lg shadow border border-slate-200'>
              <h3 className='font-semibold mb-2'>{t('app.generatedIcal')}</h3>
              <Textarea value={icalOutput} readOnly className='h-64 font-mono text-xs mb-4' />
              <Button onClick={handleDownload} className='w-full'>
                <Download className='mr-2 h-4 w-4' /> {t('app.downloadIcs')}
              </Button>
            </div>

            <div className='bg-white p-4 rounded-lg shadow border border-slate-200'>
              <h3 className='font-semibold mb-2'>{t('app.about')}</h3>
              <p className='text-sm text-slate-600'>{t('app.aboutText')}</p>
            </div>
            <FAQModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
          </div>
        </div>

        <footer className='text-center text-sm text-slate-500 flex justify-center gap-4 mt-8 pb-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => window.open('https://github.com/ak1ra-lab/lunar-birthday-ical', '_blank')}
          >
            <GithubIcon className='mr-2 h-4 w-4' /> {t('app.github')}
          </Button>
          <Button variant='ghost' size='sm' onClick={() => setIsFaqOpen(true)}>
            <HelpCircle className='mr-2 h-4 w-4' /> FAQ
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default App;
