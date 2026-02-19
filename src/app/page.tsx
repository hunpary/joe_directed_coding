'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateLuckyLottoMessage } from '@/ai/flows/generate-lucky-lotto-message';
import { Clover, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LottoPangPangPage() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [luckyMessage, setLuckyMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerateNumbers = async () => {
    setIsLoading(true);
    setNumbers([]);
    setLuckyMessage('');

    // Animate button click
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate 6 unique numbers between 1 and 45
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < 6) {
      const randomNumber = Math.floor(Math.random() * 45) + 1;
      uniqueNumbers.add(randomNumber);
    }
    const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
    setNumbers(sortedNumbers);

    try {
      const result = await generateLuckyLottoMessage({ lottoNumbers: sortedNumbers });
      setLuckyMessage(result.message);
    } catch (error) {
      console.error('Error generating lucky message:', error);
      toast({
        variant: 'destructive',
        title: '오류 발생',
        description: '행운 메시지를 생성하는 데 실패했습니다. 다시 시도해주세요.',
      });
      setLuckyMessage('행운 메시지를 불러오는 데 실패했어요. 하지만 생성된 번호에는 행운이 가득할 거예요!');
    } finally {
      setIsLoading(false);
    }
  };

  const getBallColor = (number: number) => {
    if (number <= 10) return "bg-chart-4 text-card-foreground border-chart-4";
    if (number <= 20) return "bg-chart-3 text-primary-foreground border-chart-3";
    if (number <= 30) return "bg-chart-1 text-primary-foreground border-chart-1";
    if (number <= 40) return "bg-muted text-muted-foreground border-border";
    return "bg-chart-2 text-primary-foreground border-chart-2";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-background selection:bg-primary/20">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3">
          <Clover className="w-10 h-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary font-headline">
            로또팡팡
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          AI가 추천하는 행운의 번호를 받아보세요!
        </p>
      </header>

      <main className="w-full max-w-2xl">
        <Card className="shadow-2xl shadow-primary/10 overflow-hidden">
          <CardContent className="p-6 sm:p-8 min-h-[260px] flex flex-col justify-center">
            {numbers.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <p className='text-lg'>버튼을 눌러 행운의 번호를 생성하세요!</p>
                <div className="flex justify-center gap-3 mt-4 text-primary/50">
                    <Star className="w-8 h-8 animate-pulse" style={{animationDelay: '0s'}}/>
                    <Star className="w-8 h-8 animate-pulse" style={{animationDelay: '0.2s'}}/>
                    <Star className="w-8 h-8 animate-pulse" style={{animationDelay: '0.4s'}}/>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-center items-center flex-wrap gap-3 sm:gap-4 mb-8">
                  {numbers.map((num, index) => (
                    <div
                      key={num}
                      className={cn(
                        'flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border-4 rounded-full font-bold text-2xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-110',
                        'animate-in fade-in zoom-in-90',
                        getBallColor(num)
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />

                <div className="text-center">
                  <h3 className="flex items-center justify-center text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-3">
                    <Sparkles className="w-4 h-4 mr-2 text-chart-4" />
                    AI 행운 메시지
                  </h3>
                  {luckyMessage ? (
                     <p key={luckyMessage} className="text-lg font-medium text-foreground animate-in fade-in duration-500">
                        "{luckyMessage}"
                     </p>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="mt-8">
        <Button
          size="lg"
          onClick={handleGenerateNumbers}
          disabled={isLoading}
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
        >
          {isLoading && numbers.length > 0 ? (
            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Star className="mr-2 h-5 w-5" />
          )}
          {isLoading ? '번호 생성 중...' : '새로운 번호 생성'}
        </Button>
      </footer>
    </div>
  );
}
