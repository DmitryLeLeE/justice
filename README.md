# Атлас справедливости

Сайт с зарисовками судебных процессов из разных частей света: карта, страница у каждого дела, краткое описание, итог, источники и место для рисунка из зала суда.

Стек: [Astro](https://astro.build) (статическая сборка), [Leaflet](https://leafletjs.com) для карты, подложка OpenStreetMap.

## Запуск

```bash
npm install
npm run dev      # http://localhost:4321/justice/
npm run build    # сборка в dist/
npm run preview  # проверить собранный сайт
```

## Как добавить дело

Каждое дело — один файл в `src/content/cases/`. Имя файла становится адресом страницы: `rivonia.md` открывается как `/cases/rivonia/`. В начале файла идут данные, ниже — текст в два-три абзаца.

```md
---
title: Название процесса
titleOriginal: Название на языке страны   # необязательно
country: Страна
city: Город
court: Название суда
region: europe          # europe, north-america, south-america, africa, asia, oceania
category: political     # international, transitional, political, miscarriage, society
lat: 48.85
lng: 2.35
yearStart: 1899
yearEnd: 1906           # необязательно
summary: Одно-два предложения для карточки и окна на карте (до 240 знаков).
outcome: Чем закончилось.
image:                  # необязательно
  src: sketches/example.jpg
  alt: Что изображено
  artist: Имя художника
  caption: Что на рисунке и когда сделан
  license: Public domain
  sourceUrl: https://example.org/page
sources:
  - title: Название источника
    url: https://example.org/source
draft: false            # true — дело не попадёт на сайт
---

Текст описания.
```

Если поля заполнены неверно (опечатка в `region`, нет `sources`, слишком длинное `summary`), сборка остановится и покажет, в каком файле ошибка.

## Рисунки

Файлы кладут в `public/sketches/`, в данных пишут путь `sketches/имя-файла.jpg`. Рисунок добавляют, только если у него свободная лицензия или есть разрешение правообладателя. Поля `artist`, `license` и `sourceUrl` выводятся под рисунком на странице дела. Пока рисунка нет, показывается заглушка.

## Публикация

Сайт выкладывается на GitHub Pages через `.github/workflows/deploy.yml` при каждом пуше в `main`. Один раз нужно включить: *Settings → Pages → Build and deployment → Source: GitHub Actions*. Адрес: <https://dmitrylelee.github.io/justice/>.

Если сайт переедет на свой домен, в `astro.config.mjs` меняют `site` и убирают `base`.
