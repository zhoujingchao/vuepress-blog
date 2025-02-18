# Flex/Grid布局

Flexbox和Grid是CSS中用于布局设计的两个强大工具，各自有其适用的场景和特性。了解如何使用它们可以帮助你创建响应式和现代的网页布局。

## Flexbox

Flexbox（弹性布局）是一种一维布局模型，适合用于需要在一个方向上（水平或垂直）排列项目的场合，比如导航栏、按钮组等。它非常擅长处理项目在容器中的对齐、分布和空间分配。

### 基本用法

```html
<div class="flex-container">
  <div class="flex-item">Item 1</div>
  <div class="flex-item">Item 2</div>
  <div class="flex-item">Item 3</div>
</div>
```

```css
.flex-container {
  display: flex; /* 激活弹性布局 */
  justify-content: space-between; /* 项目之间的空间分布 */
  align-items: center; /* 垂直居中对齐项目 */
}

.flex-item {
  background-color: #3498db;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
```

### Flexbox特性

- **`justify-content`**: 控制主轴上的对齐方式（左右）。
- **`align-items`**: 控制交叉轴上的对齐方式（上下）。
- **`flex-direction`**: 设置项目排列方向（如行或列）。
- **`flex-wrap`**: 允许项目换行。
- **`flex`属性**: 控制项目的尺寸和缩放。

## Grid

Grid布局是一个二维布局模型，适用于创建复杂的布局，比如整个页面结构。它允许在行和列之间同时进行控制和对齐。

### 基本用法

```html
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
  <div class="grid-item">Item 4</div>
</div>
```

```css
.grid-container {
  display: grid; /* 激活网格布局 */
  grid-template-columns: repeat(2, 1fr); /* 定义两列，每列宽度相等 */
  gap: 10px; /* 设置网格间距 */
}

.grid-item {
  background-color: #2ecc71;
  color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}
```

### Grid特性

- **`grid-template-columns`/`grid-template-rows`**: 定义网格的列和行。
- **`grid-column`/`grid-row`**: 指定项目在网格中的位置和跨度。
- **`gap`**: 控制网格项目之间的间距。
- **`grid-area`**: 在模板区域中定义项目位置。
- **`align-items`/`justify-items`**: 控制单元格内容的对齐方式。

## Flexbox vs Grid

- **Flexbox**: 更适合线性布局，单一维度的排列和对齐（行或列）。
- **Grid**: 更适合复杂的页面布局，二维的排列和对齐（行和列同时）。

两者可以结合使用，Flexbox在组件内，Grid在页面总体布局上，这样可以充分利用各自的优点来实现响应式、灵活的网页设计。选择哪个取决于具体的设计需求和布局复杂度。

## 更多细节请参考

[阮一峰flex语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[阮一峰flex实例篇](https://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

[阮一峰grid网格布局](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
