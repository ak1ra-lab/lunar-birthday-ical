import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {AppConfig, DEFAULT_CONFIG, EventConfig, GlobalConfig} from '@/types';
import {ConfigForm} from '@/components/ConfigForm';
import {EventList} from '@/components/EventList';
import {EventForm} from '@/components/EventForm';
import {generateICal} from '@/lib/ical';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {saveAs} from 'file-saver';
import {Download, Upload, Save, Github} from 'lucide-react';
import {format} from 'date-fns';

function App() {
  const {t, i18n} = useTranslation();
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('lunar-birthday-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [editingEvent, setEditingEvent] = useState<EventConfig | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [icalOutput, setIcalOutput] = useState('');

  useEffect(() => {
    localStorage.setItem('lunar-birthday-config', JSON.stringify(config));
    generateICal(config, t).then(setIcalOutput).catch(console.error);
  }, [config, t]);

  const handleGlobalSave = (global: GlobalConfig) => {
    setConfig((prev) => ({...prev, global}));
  };

  const handleEventSave = (event: EventConfig) => {
    setConfig((prev) => {
      const exists = prev.events.find((e) => e.id === event.id);
      if (exists) {
        return {...prev, events: prev.events.map((e) => e.id === event.id ? event : e)};
      } else {
        return {...prev, events: [...prev.events, event]};
      }
    });
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleEventDelete = (id: string) => {
    setConfig((prev) => ({...prev, events: prev.events.filter((e) => e.id !== id)}));
  };

  const handleDownload = () => {
    const blob = new Blob([icalOutput], {type: 'text/calendar;charset=utf-8'});
    let filename = 'lunar-birthday.ics';
    if (config.events.length > 0) {
      const name = config.events[0].name.replace(/\s+/g, '_'); // Replace spaces with underscores
      const date = format(new Date(), 'yyyyMMdd');
      filename = `lunar-birthday-${name}-${date}.ics`;
    }
    saveAs(blob, filename);
  };

  const handleExportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {type: 'application/json'});
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

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{t('app.title')}</h1>
            <p className="text-slate-500">{t('app.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="ghost" size="sm" onClick={() => window.open('https://github.com/ak1ra-lab/lunar-birthday-ical', '_blank')}>
              <Github className="mr-2 h-4 w-4" /> {t('app.github')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}>
              {i18n.language === 'zh' ? 'English' : '中文'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportConfig}>
              <Save className="mr-2 h-4 w-4" /> {t('common.export')}
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" /> {t('common.import')}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {isAddingEvent || editingEvent ? (
              <EventForm
                initialData={editingEvent || undefined}
                onSave={handleEventSave}
                onCancel={() => {
                  setIsAddingEvent(false); setEditingEvent(null);
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
              </>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
              <h3 className="font-semibold mb-2">{t('app.generatedIcal')}</h3>
              <Textarea
                value={icalOutput}
                readOnly
                className="h-64 font-mono text-xs mb-4"
              />
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" /> {t('app.downloadIcs')}
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
              <h3 className="font-semibold mb-2">{t('app.about')}</h3>
              <p className="text-sm text-slate-600">
                 {t('app.aboutText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
