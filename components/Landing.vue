<template>
  <div>
    <div class="text-lg font-bold text-emerald-600 my-3 text-center">
      日本鐵道知識大考驗！<br />從經過路線猜車站名稱
    </div>
    <h2 class="text-xl font-bold mb-2">遊戲流程</h2>
    <div class="mb-3">
      <h3 class="text-lg font-semibold text-emerald-800">遊戲設定</h3>
      <ol class="list-decimal ps-6">
        <li>選擇一或多個地區（都道府縣）</li>
        <li>設定車站需至少幾條路線經過</li>
        <li>選擇題數</li>
        <li>
          選擇<span class="font-bold">練習模式</span>或<span class="font-bold"
            >挑戰模式</span
          >
        </li>
      </ol>
    </div>
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-emerald-800">開始遊戲</h3>
      每題會顯示某車站的所有鐵道路線
      <ol class="list-[lower-alpha] ps-6">
        <li>
          練習模式
          <ul class="list-disc ps-6">
            <li>點擊「看答案」顯示解答</li>
            <li>自行選擇「答對」或「答錯」</li>
          </ul>
        </li>
        <li>
          挑戰模式
          <ul class="list-disc ps-6">
            <li>輸入車站名稱（需完全一致）</li>
          </ul>
        </li>
      </ol>
    </div>
    <div class="text-center py-4">
      <button
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-md"
      >
        準備好了！
      </button>
    </div>
  </div>
</template>
