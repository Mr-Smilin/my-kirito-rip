import React, { useState, useEffect, useMemo } from 'react';

const BackgroundImages = ({ totalImages = 8 }) => {

    const baseUrl = process.env.PUBLIC_URL || '';

  // 生成圖片陣列，使用 totalImages 參數控制數量
  const images = useMemo(() => {
    return Array.from({ length: totalImages }, (_, i) => 
      `${baseUrl}/backgrounds/${String(i + 1).padStart(2, '0')}.jpg`
    );
  }, [totalImages]);

  // 追蹤每個顯示點的當前圖片和狀態
  const [displayPoints, setDisplayPoints] = useState([
    { index: 0, isVisible: false, position: 'left-bottom' },
    { index: 1, isVisible: false, position: 'top-center' },
    { index: 2, isVisible: false, position: 'right-center' }
  ]);

  // 取得下一張圖片索引
  const getNextIndex = (currentIndex) => {
    return (currentIndex + 1) % images.length;
  };

  // 更新單個顯示點
  const updateDisplayPoint = (pointIndex, delay) => {
    setTimeout(() => {
      setDisplayPoints(prev => {
        const newPoints = [...prev];
        const currentPoint = { ...newPoints[pointIndex] };
        
        // 開始顯示
        currentPoint.isVisible = true;
        currentPoint.startTime = Date.now();
        newPoints[pointIndex] = currentPoint;
        
        return newPoints;
      });

      // 設定消失時間
      setTimeout(() => {
        // 先讓當前圖片消失
        setDisplayPoints(prev => {
          const newPoints = [...prev];
          const currentPoint = { ...newPoints[pointIndex] };
          currentPoint.isVisible = false;
          newPoints[pointIndex] = currentPoint;
          return newPoints;
        });

        // 0.5秒後顯示新圖片
        setTimeout(() => {
          setDisplayPoints(prev => {
            const newPoints = [...prev];
            const currentPoint = { ...newPoints[pointIndex] };
            currentPoint.index = getNextIndex(currentPoint.index);
            currentPoint.isVisible = true;
            newPoints[pointIndex] = currentPoint;
            return newPoints;
          });

          // 5秒後重複循環
          setTimeout(() => {
            updateDisplayPoint(pointIndex, 0);
          }, 5000);
        }, 500); // 等待0.5秒後顯示新圖片
      }, 5000); // 顯示5秒
    }, delay);
  };

  // 初始化動畫循環
  useEffect(() => {
    updateDisplayPoint(0, 0);    // 立即開始第一個點
    updateDisplayPoint(1, 2000); // 2秒後開始第二個點
    updateDisplayPoint(2, 4000); // 4秒後開始第三個點

    return () => {
      // 清理所有計時器
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {displayPoints.map((point, index) => {
        const imgSrc = images[point.index];
        if (!point.isVisible || !imgSrc) return null;

        // 根據不同顯示點設定不同的動畫樣式
        let animationClass = '';
        let positionClass = '';
        
        switch (index) {
          case 0: // 左下角點
            animationClass = 'animate-leftBottom';
            positionClass = 'left-[0px] bottom-[0px] w-[300px] h-[300px]';
            break;
          case 1: // 上方中心點
            animationClass = 'animate-topCenter';
            positionClass = 'left-1/2 top-[100px] -translate-x-1/2 w-[400px] h-[400px]';
            break;
          case 2: // 右側中心點
            animationClass = 'animate-rightRandom';
            positionClass = 'right-[100px] top-1/2 -translate-y-1/2 w-[350px] h-[350px]';
            break;
          default:
            break;
        }

        return (
          <img
            key={`${index}-${point.index}`}
            src={imgSrc}
            alt=""
            className={`absolute object-contain ${animationClass} ${positionClass}`}
          />
        );
      })}
    </div>
  );
};

export { BackgroundImages };