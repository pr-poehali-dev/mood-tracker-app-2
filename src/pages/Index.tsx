import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Emotion = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'stressed';
type DiaryEntry = {
  id: string;
  date: string;
  emotion: Emotion;
  stressLevel: number;
  trigger: string;
};

type Technique = {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: string[];
  icon: string;
  isFavorite: boolean;
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([
    {
      id: '1',
      date: '2024-12-17',
      emotion: 'calm',
      stressLevel: 3,
      trigger: 'Хорошо поработал над проектом',
    },
  ]);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('calm');
  const [stressLevel, setStressLevel] = useState([5]);
  const [trigger, setTrigger] = useState('');

  const [techniques, setTechniques] = useState<Technique[]>([
    {
      id: '1',
      title: 'Дыхание 4-7-8',
      category: 'Дыхательные практики',
      description: 'Техника глубокого дыхания для снятия тревожности',
      steps: [
        'Сделайте глубокий вдох через нос на 4 счета',
        'Задержите дыхание на 7 счетов',
        'Медленно выдохните через рот на 8 счетов',
        'Повторите цикл 4-5 раз',
      ],
      icon: 'Wind',
      isFavorite: false,
    },
    {
      id: '2',
      title: 'Прогрессивная мышечная релаксация',
      category: 'Физические упражнения',
      description: 'Последовательное напряжение и расслабление мышц',
      steps: [
        'Сядьте или лягте в удобное положение',
        'Начните с мышц лица: напрягите на 5 секунд, затем расслабьте',
        'Переходите к плечам, рукам, животу, ногам',
        'Сосредоточьтесь на ощущении расслабления',
      ],
      icon: 'Activity',
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Техника заземления 5-4-3-2-1',
      category: 'Психологические приёмы',
      description: 'Возвращение в настоящий момент через органы чувств',
      steps: [
        'Назовите 5 вещей, которые вы видите',
        'Назовите 4 вещи, которые вы чувствуете',
        'Назовите 3 вещи, которые вы слышите',
        'Назовите 2 вещи, которые вы обоняете',
        'Назовите 1 вещь, которую вы ощущаете на вкус',
      ],
      icon: 'Brain',
      isFavorite: false,
    },
  ]);

  const emotions: { value: Emotion; label: string; emoji: string; color: string }[] = [
    { value: 'happy', label: 'Радость', emoji: '😊', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { value: 'calm', label: 'Спокойствие', emoji: '😌', color: 'bg-blue-100 hover:bg-blue-200' },
    { value: 'anxious', label: 'Тревога', emoji: '😰', color: 'bg-purple-100 hover:bg-purple-200' },
    { value: 'sad', label: 'Грусть', emoji: '😢', color: 'bg-gray-100 hover:bg-gray-200' },
    { value: 'angry', label: 'Злость', emoji: '😠', color: 'bg-red-100 hover:bg-red-200' },
    { value: 'stressed', label: 'Стресс', emoji: '😫', color: 'bg-orange-100 hover:bg-orange-200' },
  ];

  const saveDiaryEntry = () => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      emotion: currentEmotion,
      stressLevel: stressLevel[0],
      trigger: trigger,
    };
    setDiaryEntries([newEntry, ...diaryEntries]);
    setTrigger('');
  };

  const toggleFavorite = (id: string) => {
    setTechniques(
      techniques.map((tech) => (tech.id === id ? { ...tech, isFavorite: !tech.isFavorite } : tech))
    );
  };

  const getEmotionEmoji = (emotion: Emotion) => {
    return emotions.find((e) => e.value === emotion)?.emoji || '😊';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">Психологическая поддержка</h1>
          <p className="text-purple-700">Забота о вашем ментальном здоровье</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-sm">
            <TabsTrigger value="home" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="diary" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Icon name="BookHeart" size={18} className="mr-2" />
              Дневник
            </TabsTrigger>
            <TabsTrigger value="techniques" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Техники
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Icon name="History" size={18} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="tests" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Icon name="ClipboardCheck" size={18} className="mr-2" />
              Диагностика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Icon name="Heart" size={24} className="text-pink-500" />
                    Добро пожаловать!
                  </CardTitle>
                  <CardDescription>Как вы себя чувствуете сегодня?</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Это пространство создано для вашего комфорта и поддержки. Здесь вы можете вести дневник
                    настроения, изучать техники самопомощи и отслеживать своё эмоциональное состояние.
                  </p>
                  <Button onClick={() => setActiveTab('diary')} className="w-full rounded-xl">
                    Создать запись в дневнике
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Icon name="TrendingUp" size={24} className="text-blue-500" />
                    Ваша статистика
                  </CardTitle>
                  <CardDescription>Последние записи</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <span className="text-sm font-medium">Записей в дневнике</span>
                      <Badge variant="secondary" className="text-lg">
                        {diaryEntries.length}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                      <span className="text-sm font-medium">Избранных техник</span>
                      <Badge variant="secondary" className="text-lg">
                        {techniques.filter((t) => t.isFavorite).length}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Icon name="Lightbulb" size={24} className="text-yellow-500" />
                  Быстрый доступ к техникам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {techniques.slice(0, 3).map((tech) => (
                    <div
                      key={tech.id}
                      className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setActiveTab('techniques')}
                    >
                      <Icon name={tech.icon as any} size={32} className="text-purple-500 mb-2" />
                      <h3 className="font-semibold text-sm mb-1">{tech.title}</h3>
                      <p className="text-xs text-muted-foreground">{tech.category}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diary" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Icon name="PenLine" size={24} className="text-purple-500" />
                  Дневник настроения
                </CardTitle>
                <CardDescription>Запишите своё состояние и эмоции</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Как вы себя чувствуете?</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.value}
                        onClick={() => setCurrentEmotion(emotion.value)}
                        className={`p-4 rounded-2xl transition-all ${emotion.color} ${
                          currentEmotion === emotion.value
                            ? 'ring-4 ring-purple-400 scale-105'
                            : 'hover:scale-105'
                        }`}
                      >
                        <div className="text-4xl mb-1">{emotion.emoji}</div>
                        <div className="text-xs font-medium">{emotion.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Уровень стресса: {stressLevel[0]}/10
                  </label>
                  <Slider
                    value={stressLevel}
                    onValueChange={setStressLevel}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Спокойствие</span>
                    <span>Высокий стресс</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Заметки о триггерах или событиях</label>
                  <Textarea
                    placeholder="Что повлияло на ваше настроение сегодня?"
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="min-h-[120px] rounded-xl"
                  />
                </div>

                <Button onClick={saveDiaryEntry} className="w-full rounded-xl" size="lg">
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить запись
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techniques" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Icon name="Sparkles" size={24} className="text-purple-500" />
                  Техники самопомощи
                </CardTitle>
                <CardDescription>Пошаговые инструкции для улучшения самочувствия</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {techniques.map((tech) => (
                    <Card key={tech.id} className="border-purple-100 shadow hover:shadow-md transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                              <Icon name={tech.icon as any} size={24} className="text-purple-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tech.title}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {tech.category}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(tech.id)}
                            className="rounded-full"
                          >
                            <Icon
                              name="Heart"
                              size={20}
                              className={tech.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>
                        <Accordion type="single" collapsible>
                          <AccordionItem value="steps">
                            <AccordionTrigger className="text-sm font-medium">
                              Показать инструкцию
                            </AccordionTrigger>
                            <AccordionContent>
                              <ol className="space-y-2 mt-2">
                                {tech.steps.map((step, index) => (
                                  <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-medium">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Icon name="CalendarDays" size={24} className="text-purple-500" />
                  История записей
                </CardTitle>
                <CardDescription>Ваши предыдущие записи в дневнике</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {diaryEntries.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Пока нет записей. Создайте первую запись в дневнике!</p>
                      </div>
                    ) : (
                      diaryEntries.map((entry) => (
                        <Card key={entry.id} className="border-purple-100">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="text-5xl">{getEmotionEmoji(entry.emotion)}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{entry.date}</Badge>
                                  <Badge
                                    variant="secondary"
                                    className={
                                      entry.stressLevel > 7
                                        ? 'bg-red-100 text-red-700'
                                        : entry.stressLevel > 4
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                    }
                                  >
                                    Стресс: {entry.stressLevel}/10
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{entry.trigger}</p>
                                <div className="mt-4 p-3 bg-purple-50 rounded-xl">
                                  <p className="text-xs font-medium text-purple-900 mb-1">
                                    💡 Рекомендация:
                                  </p>
                                  <p className="text-xs text-purple-700">
                                    {entry.stressLevel > 7
                                      ? 'Попробуйте технику глубокого дыхания 4-7-8 для снижения стресса'
                                      : entry.stressLevel > 4
                                      ? 'Рекомендуем прогрессивную мышечную релаксацию'
                                      : 'Продолжайте практиковать техники осознанности для поддержания баланса'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BrainCircuit" size={24} className="text-purple-500" />
                    Тест на тревожность
                  </CardTitle>
                  <CardDescription>Оцените уровень тревожности за последние 2 недели</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Короткий тест из 7 вопросов поможет определить уровень тревожности и даст персональные
                    рекомендации.
                  </p>
                  <Button className="w-full rounded-xl">
                    <Icon name="Play" size={18} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Zap" size={24} className="text-orange-500" />
                    Тест на стресс
                  </CardTitle>
                  <CardDescription>Определите текущий уровень стресса</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Экспресс-диагностика стресса с автоматической интерпретацией результатов и практическими
                    советами.
                  </p>
                  <Button className="w-full rounded-xl">
                    <Icon name="Play" size={18} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Flame" size={24} className="text-red-500" />
                    Тест на выгорание
                  </CardTitle>
                  <CardDescription>Проверьте признаки эмоционального выгорания</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Комплексная оценка симптомов выгорания с рекомендациями по восстановлению и профилактике.
                  </p>
                  <Button className="w-full rounded-xl">
                    <Icon name="Play" size={18} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <Icon name="FileText" size={24} className="text-purple-600" />
                    Результаты тестов
                  </CardTitle>
                  <CardDescription>История пройденных диагностик</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="ClipboardList" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm">Здесь будут отображаться результаты ваших тестов</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-8 right-8 rounded-full shadow-2xl bg-red-500 hover:bg-red-600 text-white px-6 py-6 animate-pulse"
            >
              <Icon name="Phone" size={24} className="mr-2" />
              Срочная помощь
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Icon name="AlertCircle" size={24} />
                Экстренная помощь
              </DialogTitle>
              <DialogDescription>Контакты служб психологической поддержки</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card className="border-red-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Phone" size={20} className="text-red-500" />
                    <h3 className="font-semibold">Телефон доверия</h3>
                  </div>
                  <a href="tel:88002000122" className="text-lg font-bold text-red-600 hover:underline">
                    8-800-2000-122
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Круглосуточно, бесплатно</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="MessageCircle" size={20} className="text-orange-500" />
                    <h3 className="font-semibold">Психологическая помощь</h3>
                  </div>
                  <a href="tel:051" className="text-lg font-bold text-orange-600 hover:underline">
                    051
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Служба экстренной психологической помощи</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Ambulance" size={20} className="text-blue-500" />
                    <h3 className="font-semibold">Скорая помощь</h3>
                  </div>
                  <a href="tel:103" className="text-lg font-bold text-blue-600 hover:underline">
                    103
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Экстренная медицинская помощь</p>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
