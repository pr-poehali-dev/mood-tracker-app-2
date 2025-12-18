import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type Emotion = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'stressed';

type DiaryEntry = {
  id: string;
  date: string;
  emotion: Emotion;
  stressLevel: number;
  trigger: string;
  notes: string;
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

type TestResult = {
  id: string;
  testType: 'anxiety' | 'stress' | 'burnout';
  testName: string;
  date: string;
  score: number;
  level: string;
  recommendation: string;
};

type User = {
  name: string;
  email: string;
  password: string;
  diaryEntries: DiaryEntry[];
  techniques: Technique[];
  testResults: TestResult[];
};

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState<'login' | 'register'>('login');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [activeTab, setActiveTab] = useState('diary');
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('calm');
  const [stressLevel, setStressLevel] = useState([5]);
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');

  const [testInProgress, setTestInProgress] = useState<'anxiety' | 'stress' | 'burnout' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testAnswers, setTestAnswers] = useState<number[]>([]);

  const emotions: { value: Emotion; label: string; emoji: string; color: string }[] = [
    { value: 'happy', label: 'Радость', emoji: '😊', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
    { value: 'calm', label: 'Спокойствие', emoji: '😌', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { value: 'anxious', label: 'Тревога', emoji: '😰', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
    { value: 'sad', label: 'Грусть', emoji: '😢', color: 'bg-gray-50 hover:bg-gray-100 border-gray-200' },
    { value: 'angry', label: 'Злость', emoji: '😠', color: 'bg-red-50 hover:bg-red-100 border-red-200' },
    { value: 'stressed', label: 'Стресс', emoji: '😫', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  ];

  const defaultTechniques: Technique[] = [
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
  ];

  const anxietyQuestions = [
    'Как часто вы чувствуете нервозность или напряжение?',
    'Как часто вы не можете остановить беспокойство?',
    'Как часто вы беспокоитесь о разных вещах?',
    'Как часто вам трудно расслабиться?',
    'Как часто вы чувствуете беспокойство и не можете усидеть на месте?',
    'Как часто вы раздражаетесь или злитесь?',
    'Как часто вы чувствуете страх, что может случиться что-то ужасное?',
  ];

  const stressQuestions = [
    'Как часто вы чувствуете себя перегруженным?',
    'Как часто вам трудно справиться с повседневными задачами?',
    'Как часто вы чувствуете физическое напряжение?',
    'Как часто вы испытываете трудности с концентрацией?',
    'Как часто у вас бывают головные боли или боли в теле?',
  ];

  const burnoutQuestions = [
    'Как часто вы чувствуете эмоциональное истощение?',
    'Как часто работа кажется вам бессмысленной?',
    'Как часто вы чувствуете отстранённость от людей?',
    'Как часто вы теряете интерес к своей деятельности?',
    'Как часто вы чувствуете снижение продуктивности?',
    'Как часто у вас появляется циничное отношение к работе?',
  ];

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    const savedAuth = localStorage.getItem('currentUser');
    if (savedAuth) {
      const user = JSON.parse(savedAuth);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleRegister = () => {
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    if (users.find((u) => u.email === registerEmail)) {
      toast.error('Пользователь с такой почтой уже существует');
      return;
    }
    const newUser: User = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      diaryEntries: [],
      techniques: defaultTechniques,
      testResults: [],
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsAuthenticated(true);
    toast.success('Регистрация успешна!');
  };

  const handleLogin = () => {
    const user = users.find((u) => u.email === loginEmail && u.password === loginPassword);
    if (!user) {
      toast.error('Неверная почта или пароль');
      return;
    }
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setIsAuthenticated(true);
    toast.success('Добро пожаловать!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Вы вышли из аккаунта');
  };

  const handleDeleteAccount = () => {
    if (!currentUser) return;
    const updatedUsers = users.filter((u) => u.email !== currentUser.email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    toast.success('Аккаунт удалён');
  };

  const saveDiaryEntry = () => {
    if (!currentUser) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      emotion: currentEmotion,
      stressLevel: stressLevel[0],
      trigger: trigger,
      notes: notes,
    };
    const updatedUser = {
      ...currentUser,
      diaryEntries: [newEntry, ...currentUser.diaryEntries],
    };
    updateCurrentUser(updatedUser);
    setTrigger('');
    setNotes('');
    toast.success('Запись сохранена');
  };

  const toggleFavorite = (id: string) => {
    if (!currentUser) return;
    const updatedTechniques = currentUser.techniques.map((tech) =>
      tech.id === id ? { ...tech, isFavorite: !tech.isFavorite } : tech
    );
    const updatedUser = { ...currentUser, techniques: updatedTechniques };
    updateCurrentUser(updatedUser);
  };

  const updateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    const updatedUsers = users.map((u) => (u.email === updatedUser.email ? updatedUser : u));
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const startTest = (type: 'anxiety' | 'stress' | 'burnout') => {
    setTestInProgress(type);
    setCurrentQuestion(0);
    setTestAnswers([]);
  };

  const answerQuestion = (answer: number) => {
    const newAnswers = [...testAnswers, answer];
    setTestAnswers(newAnswers);
    
    const questions = 
      testInProgress === 'anxiety' ? anxietyQuestions :
      testInProgress === 'stress' ? stressQuestions :
      burnoutQuestions;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest(newAnswers);
    }
  };

  const completeTest = (answers: number[]) => {
    if (!currentUser || !testInProgress) return;
    
    const totalScore = answers.reduce((sum, ans) => sum + ans, 0);
    const maxScore = answers.length * 4;
    const percentage = (totalScore / maxScore) * 100;
    
    let level = '';
    let recommendation = '';
    
    if (percentage < 33) {
      level = 'Низкий';
      recommendation = 'Ваши показатели в норме. Продолжайте практиковать техники осознанности.';
    } else if (percentage < 66) {
      level = 'Средний';
      recommendation = 'Рекомендуем регулярно использовать техники релаксации и дыхательные практики.';
    } else {
      level = 'Высокий';
      recommendation = 'Рекомендуем обратиться к специалисту. Используйте техники самопомощи ежедневно.';
    }

    const testName = 
      testInProgress === 'anxiety' ? 'Тест на тревожность' :
      testInProgress === 'stress' ? 'Тест на стресс' :
      'Тест на выгорание';

    const result: TestResult = {
      id: Date.now().toString(),
      testType: testInProgress,
      testName,
      date: new Date().toISOString().split('T')[0],
      score: Math.round(percentage),
      level,
      recommendation,
    };

    const updatedUser = {
      ...currentUser,
      testResults: [result, ...currentUser.testResults],
    };
    updateCurrentUser(updatedUser);
    
    setTestInProgress(null);
    setCurrentQuestion(0);
    setTestAnswers([]);
    toast.success('Тест завершён! Результаты сохранены в профиле.');
  };

  const getEmotionEmoji = (emotion: Emotion) => {
    return emotions.find((e) => e.value === emotion)?.emoji || '😊';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-none">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icon name="Heart" size={32} className="text-teal-500" />
              <h1 className="text-2xl font-bold text-teal-900">Забота о себе</h1>
            </div>
            <CardDescription>Позаботьтесь о своем ментальном здоровье</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={showAuth} onValueChange={(v) => setShowAuth(v as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Электронная почта</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Войти
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Имя</Label>
                  <Input
                    id="register-name"
                    placeholder="Ваше имя"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Электронная почта</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleRegister} className="w-full">
                  Зарегистрироваться
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testInProgress) {
    const questions = 
      testInProgress === 'anxiety' ? anxietyQuestions :
      testInProgress === 'stress' ? stressQuestions :
      burnoutQuestions;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">Вопрос {currentQuestion + 1} из {questions.length}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setTestInProgress(null)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <CardTitle className="text-xl">{questions[currentQuestion]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup>
              {[
                { value: 0, label: 'Никогда' },
                { value: 1, label: 'Иногда' },
                { value: 2, label: 'Часто' },
                { value: 3, label: 'Очень часто' },
                { value: 4, label: 'Постоянно' },
              ].map((option) => (
                <div
                  key={option.value}
                  onClick={() => answerQuestion(option.value)}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-input hover:border-primary cursor-pointer transition-all hover:bg-muted"
                >
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="Heart" size={28} className="text-teal-500" />
            <div>
              <h1 className="text-xl font-bold text-teal-900">Забота о себе</h1>
              <p className="text-sm text-muted-foreground">Привет, {currentUser?.name}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </header>

        <Card className="mb-6 border-none shadow-sm bg-teal-50/50">
          <CardContent className="pt-6">
            <p className="text-center text-sm text-teal-800">
              Позаботьтесь о своем ментальном здоровье
            </p>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-sm">
            <TabsTrigger value="diary" className="rounded-lg">
              <Icon name="PenLine" size={16} />
              <span className="ml-1.5 hidden sm:inline">Дневник</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg">
              <Icon name="History" size={16} />
              <span className="ml-1.5 hidden sm:inline">История</span>
            </TabsTrigger>
            <TabsTrigger value="techniques" className="rounded-lg">
              <Icon name="Sparkles" size={16} />
              <span className="ml-1.5 hidden sm:inline">Техники</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="rounded-lg">
              <Icon name="ClipboardCheck" size={16} />
              <span className="ml-1.5 hidden sm:inline">Тесты</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg">
              <Icon name="User" size={16} />
              <span className="ml-1.5 hidden sm:inline">Профиль</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diary" className="animate-fade-in">
            <Card className="shadow-sm border-teal-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="PenLine" size={20} className="text-teal-600" />
                  Новая запись
                </CardTitle>
                <CardDescription>Как вы себя чувствуете сегодня?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-3 block">Выберите эмоцию</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion.value}
                        onClick={() => setCurrentEmotion(emotion.value)}
                        className={`p-3 rounded-xl transition-all border-2 ${emotion.color} ${
                          currentEmotion === emotion.value ? 'ring-2 ring-teal-400 scale-105' : ''
                        }`}
                      >
                        <div className="text-3xl mb-1">{emotion.emoji}</div>
                        <div className="text-xs font-medium">{emotion.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Уровень стресса: {stressLevel[0]}/10
                  </label>
                  <Slider value={stressLevel} onValueChange={setStressLevel} max={10} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Спокойствие</span>
                    <span>Высокий стресс</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Триггеры (что вызвало эмоцию?)</label>
                  <Textarea
                    placeholder="Например: встреча с друзьями, работа..."
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Заметки</label>
                  <Textarea
                    placeholder="Опишите свои мысли и чувства..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <Button onClick={saveDiaryEntry} className="w-full">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить запись
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="shadow-sm border-teal-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="CalendarDays" size={20} className="text-teal-600" />
                  История записей
                </CardTitle>
                <CardDescription>Всего записей: {currentUser?.diaryEntries.length || 0}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {!currentUser?.diaryEntries.length ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="BookOpen" size={40} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">Пока нет записей</p>
                      </div>
                    ) : (
                      currentUser.diaryEntries.map((entry) => (
                        <Card key={entry.id} className="border-teal-50 bg-white">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <div className="text-4xl">{getEmotionEmoji(entry.emotion)}</div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge variant="outline" className="text-xs">{entry.date}</Badge>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      entry.stressLevel > 7
                                        ? 'bg-red-50 text-red-700'
                                        : entry.stressLevel > 4
                                        ? 'bg-yellow-50 text-yellow-700'
                                        : 'bg-green-50 text-green-700'
                                    }`}
                                  >
                                    Стресс: {entry.stressLevel}/10
                                  </Badge>
                                </div>
                                {entry.trigger && (
                                  <p className="text-sm">
                                    <strong>Триггеры:</strong> {entry.trigger}
                                  </p>
                                )}
                                {entry.notes && (
                                  <p className="text-sm text-muted-foreground">{entry.notes}</p>
                                )}
                                <div className="p-3 bg-teal-50 rounded-lg mt-2">
                                  <p className="text-xs font-medium text-teal-900 mb-1">💡 Рекомендация:</p>
                                  <p className="text-xs text-teal-700">
                                    {entry.stressLevel > 7
                                      ? 'Попробуйте технику дыхания 4-7-8 для снижения стресса'
                                      : entry.stressLevel > 4
                                      ? 'Рекомендуем прогрессивную мышечную релаксацию'
                                      : 'Отлично! Продолжайте практиковать техники осознанности'}
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

          <TabsContent value="techniques" className="animate-fade-in">
            <Card className="shadow-sm border-teal-100 mb-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Heart" size={20} className="text-pink-500" />
                  Избранные техники
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser?.techniques.filter((t) => t.isFavorite).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет избранных техник. Добавьте техники в избранное ниже.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentUser?.techniques
                      .filter((t) => t.isFavorite)
                      .map((tech) => (
                        <div key={tech.id} className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                          <Icon name={tech.icon as any} size={20} className="text-pink-600" />
                          <span className="text-sm font-medium flex-1">{tech.title}</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-teal-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Sparkles" size={20} className="text-teal-600" />
                  Все техники самопомощи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentUser?.techniques.map((tech) => (
                  <Card key={tech.id} className="border-teal-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <Icon name={tech.icon as any} size={20} className="text-teal-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{tech.title}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
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
                            size={18}
                            className={tech.isFavorite ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{tech.description}</p>
                      <details className="text-sm">
                        <summary className="cursor-pointer font-medium text-teal-700 mb-2">
                          Показать инструкцию
                        </summary>
                        <ol className="space-y-2 mt-2 pl-1">
                          {tech.steps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-medium">
                                {index + 1}
                              </span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </details>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="animate-fade-in space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="shadow-sm border-purple-100 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="BrainCircuit" size={22} className="text-purple-500" />
                    Тест на тревожность
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Оцените уровень тревожности за последние 2 недели
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startTest('anxiety')} className="w-full" size="sm">
                    <Icon name="Play" size={16} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-orange-100 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="Zap" size={22} className="text-orange-500" />
                    Тест на стресс
                  </CardTitle>
                  <CardDescription className="text-xs">Определите текущий уровень стресса</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startTest('stress')} className="w-full" size="sm">
                    <Icon name="Play" size={16} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-red-100 hover:shadow-md transition-all sm:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="Flame" size={22} className="text-red-500" />
                    Тест на эмоциональное выгорание
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Проверьте признаки эмоционального выгорания
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startTest('burnout')} className="w-full" size="sm">
                    <Icon name="Play" size={16} className="mr-2" />
                    Пройти тест
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-teal-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="FileText" size={20} className="text-teal-600" />
                  Результаты тестов
                </CardTitle>
                <CardDescription>История пройденных диагностик</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {!currentUser?.testResults.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Icon name="ClipboardList" size={40} className="mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Здесь будут результаты ваших тестов</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentUser.testResults.map((result) => (
                        <Card key={result.id} className="border-teal-50">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-sm">{result.testName}</h3>
                                <p className="text-xs text-muted-foreground">{result.date}</p>
                              </div>
                              <Badge
                                variant={
                                  result.score < 33 ? 'outline' : result.score < 66 ? 'secondary' : 'destructive'
                                }
                              >
                                {result.level}
                              </Badge>
                            </div>
                            <div className="mb-2">
                              <div className="text-xs text-muted-foreground mb-1">Результат: {result.score}%</div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    result.score < 33
                                      ? 'bg-green-500'
                                      : result.score < 66
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${result.score}%` }}
                                />
                              </div>
                            </div>
                            <div className="p-2 bg-teal-50 rounded text-xs">
                              <strong>Рекомендация:</strong> {result.recommendation}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="shadow-sm border-teal-100">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="User" size={20} className="text-teal-600" />
                  Профиль
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Имя</p>
                    <p className="font-medium">{currentUser?.name}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground">Электронная почта</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="p-3 bg-teal-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-teal-700">{currentUser?.diaryEntries.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Записей</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-pink-700">
                      {currentUser?.techniques.filter((t) => t.isFavorite).length || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Избранных</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-700">{currentUser?.testResults.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Тестов</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Icon name="Trash2" size={18} className="mr-2" />
                        Удалить аккаунт
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Все ваши данные будут удалены безвозвратно.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount}>Удалить</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-6 right-6 rounded-full shadow-2xl bg-red-500 hover:bg-red-600 text-white h-14 px-5"
            >
              <Icon name="Phone" size={20} />
              <span className="ml-2 hidden sm:inline">Срочная помощь</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Icon name="AlertCircle" size={22} />
                Нужна экстренная помощь?
              </DialogTitle>
              <DialogDescription>
                Если вы чувствуете, что находитесь в кризисной ситуации — обратитесь к профессиональной помощи
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3">
              <Card className="border-red-100 bg-red-50/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Phone" size={18} className="text-red-600" />
                    <h3 className="font-semibold text-sm">Телефон доверия</h3>
                  </div>
                  <a href="tel:88002000122" className="text-lg font-bold text-red-600 hover:underline">
                    8-800-2000-122
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Круглосуточно, бесплатно, анонимно</p>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-orange-50/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="MessageCircle" size={18} className="text-orange-600" />
                    <h3 className="font-semibold text-sm">Экстренная служба</h3>
                  </div>
                  <a href="tel:051" className="text-lg font-bold text-orange-600 hover:underline">
                    051
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Служба психологической помощи населению</p>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-blue-50/30">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Hospital" size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-sm">Скорая помощь</h3>
                  </div>
                  <a href="tel:112" className="text-lg font-bold text-blue-600 hover:underline">
                    112
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">Единый номер экстренных служб</p>
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
