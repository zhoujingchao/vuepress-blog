# 设计模式-工厂函数

## 什么是工厂模式？

工厂模式是用来创建对象的一种最常用的设计模式，我们不暴露创建对象的具体逻辑，而是提供一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类，而子类可以重写接口方法以便创建的时候指定自己的对象类型。所以这个创建对象的接口函数就可以视为一个工厂。工厂模式根据抽象程度的不同可以分为：简单工厂，工厂方法和抽象工厂。

下面，我们先以一个场景去简单的理解下抽象和工厂的概念

> 想象一下你的女朋友生日要到了，你想知道她想要什么礼物，于是你问他：“亲爱哒，生日要到了呢，你想要什么生日礼物咩？”

> 于是她回答你说：“亲爱的，我想要一只动物。”

> 你心平气和（黑人问号？？？）的问她：“想要什么动物啊？”

> 你女友说：“我想要猫科动物。”

> 这时你内心就纳闷了，猫科动物有老虎，狮子，豹子，还有各种小猫，我哪里知道你要什么？

> 于是你接着问女友：“你要哪种猫科动物啊？”

> “笨死了，还要哪种，肯定是小猫咪啊，难道我们家还能像迪拜土豪那样养老虎啊！”你女朋友答道。

> “好好， 那你想要哪个品种的猫呢？”你问道。

> “我想要国外的品种, 不要中国的土猫” 你女友傲娇的回答到。

> 这时你已经快奔溃了，作为程序员的你再也受不了这种挤牙膏式的提问，于是你哀求到：“亲爱的，你就直接告诉我你到底想要哪个品种，哪个颜色，多大的猫？”

> 你女友想了想抖音的那只猫，回答道：“我想要一只银色的，不超过1岁的英短折耳猫！”

> 于是，你在女友生日当天到文二路花鸟市场里面去，挑了一只“银色的，不超过1岁的英短折耳猫”回家送给了你女友, 圆了你女友拥有网红同款猫的梦!
![](./img/cat.jpg)

上面你最终买到并送给女友<strong>那只猫</strong>可以被看作是一个<strong>实例对象</strong>，<strong>花鸟市场</strong>可以看作是一个工厂，我们可以认为它是一个函数，这个工厂函数里面有着各种各样的动物，那么你是如何获取到实例的呢？因为你给花鸟市场传递了正确的参数, <strong>“color: 银色”，“age: 不超过1岁”，"breed:英短折耳"，“category: 猫"</strong>。前面的对话中, 你女朋友回答`动物`，`猫科动物`，`国外的品种`让你不明白她到底想要什么，就是因为她说得太抽象了。她回答的是一大类动物的共有特征而不是具体动物，这种将复杂事物的一个或多个共有特征抽取出来的思维过程就是<strong>抽象</strong>。

既然已经明白了抽象的概念，下面我们来看一下之前提到的工厂模式的三种实现方法： 简单工厂模式、工厂方法模式、抽象工厂模式。

### 简单工厂模式

简单工厂模式又叫静态工厂模式，由一个工厂对象决定创建某一种产品对象类的实例。主要用来创建同一类对象。

就以上面的对话例子做个扩展，代码如下：

```js
var petMarketFactory = function(pet) {
  function Pet(opt) {
    this.name = opt.name
  }

  switch(pet) {
    case 'cat':
      return new Pet({ name: 'cat'})
      break;
    case 'fish':
      return new Pet({ name: 'fish'})
      break;
    case 'dog':
      return new Pet({ name: 'dog'})
      break;
    default:
      throw new Error('参数错误, 可选参数:cat, fish, dog')
  }
}

var cat = petMarketFactory('cat')
var fish = petMarketFactory('fish')
var dog = petMarketFactory('dog')
```

它的优点在于你只需要一个正确参数，就可以获得你所需要的对象，而无需知道对象创建的具体逻辑。但是在函数内包含了所有对象的创建逻辑（Pet构造函数）和判断逻辑的代码，每增加新的构造函数还需要修改判断逻辑代码。当我们的对象不是上面的3个而是更多时，这个函数会成为一个庞大的超级函数，便得难以维护。所以，简单工厂只能作用于创建的对象数量较少，对象的创建逻辑不复杂时使用。

### 工厂方法模式

工厂方法模式可以看作是一个实例化对象的工厂类，代码如下：

```js
// 安全模式创建的工厂方法函数
var petMarketFactory = function(name, pet) {
  if (this instanceof petMarketFactory) {
    var o = new this[name](pet)
    return o
  } else {
    return new petMarketFactory(name, pet)
  }
}

// 工厂方法函数的原型中设置所有对象的构造函数
petMarketFactory.prototype = {
  Cat: function(pet) {
    this.name = "cat"
    this.type = pet
  },
  Fish: function(pet) {
    this.name = "fish"
    this.type = pet
  },
  Dog: function(pet) {
    this.name = 'dog'
    this.type = pet
  }
}

var cat = petMarketFactory('Cat', 'animal')
var fish = petMarketFactory('Fish', 'animal')
var dog = petMarketFactory('Dog', 'animal')
```

使用上面的模式去进行实例化，就不用担心某个阶段遗忘使用 new 操作导致对象取不到的问题了。

### 抽象工厂模式

上面介绍了简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建。

上面例子中的cat，fish，dog三种宠物，其中 cat 商家提供了不同的品种，例如：英短，美短。那么这两个种类就是对应的类簇。在抽象工厂中，类簇一般用父类定义，并在父类中定义一些抽象方法，再通过抽象工厂让子类继承父类。所以，抽象工厂其实是<strong>实现子类继承父类的方法。</strong>

上面提到的抽象方法是指声明但不能使用的方法。在其他传统面向对象的语言中常用abstract进行声明，但是在JavaScript中，abstract是属于保留字，但是我们可以通过在类的方法中抛出错误来模拟抽象类。

```js
var UsaShorthair = function() {}
UsaShorthair.prototype = {
  getName: function() {
    return new Error('抽象方法不能调用');
  }
}
```

上述代码中的 getName 就是抽象方法，我们定义它但是却没有去实现。如果子类继承 UsaShorthair 但是并没有去重写 getName，那么子类的实例化对象就会调用父类的 getName 方法并抛出错误提示。

下面我们分别来实现猫种类管理的抽象工厂方法:

```js
var TypeCatFactory = function(subType, superType) {
  // 抽象工厂中是否有该抽象类
  if (typeof TypeCatFactory[superType] === 'function') {
    function F() {}
    // 继承父类属性和方法
    F.prototype = new TypeCatFactory[superType] ()
    // 子类原型继承父类
    subType.prototype = new F()
    // 子类constructor指向自己
    subType.prototype.constructor = subType
  } else {
    throw new Error('抽象类不存在')
  }
}

// 美短猫抽象类
TypeCatFactory.UsaShorthair = function() {
  this.type = 'USA'
}
TypeCatFactory.UsaShorthair.prototype = {
  getName: function() {
    return new Error('抽象方法不能调用')
  }
}

// 英短猫抽象类
TypeCatFactory.BritishShorthair = function() {
  this.type = 'UK'
}
TypeCatFactory.BritishShorthair.prototype = {
  getName: function() {
    return new Error('抽象方法不能调用')
  }
}
```

TypeCatFactory 就是一个抽象工厂方法，该方法在参数中传递子类和父类，在方法体内部实现了子类对父类的继承。对抽象工厂方法添加抽象类的方法我们是通过点语法进行添加的。

下面我们来定义猫的子类:

```js
// 美短猫子类
function CatOfUsa(name) {
  this.name = name
}
// 抽象工厂实现 UsaShorthair 类的继承
TypeCatFactory(CatOfUsa, 'UsaShorthair')
// 子类中重写抽象方法
CatOfUsa.prototype.getName = function() {
  return this.name
}

// 英短猫子类
function CatOfUk(name) {
  this.name = name
}
// 抽象工厂实现 BritishShorthair 类的继承
TypeCatFactory(CatOfUk, 'BritishShorthair')
// 子类中重写抽象方法
CatOfUk.prototype.getName = function() {
  return this.name
}
```

上述代码我们分别定义了CatOfUsa，CatOfUk两种类。这两个类作为子类通过抽象工厂方法实现继承。特别需要注意的是，调用抽象工厂方法后不要忘记重写抽象方法，否则在子类的实例中调用抽象方法会报错。

我们来分别对这两种类进行实例化，检测抽象工厂方法是实现了类簇的管理。

```js
// 实例化美短猫
var UsaCatA = new CatOfUsa('美短逗逗')
console.log(UsaCatA.getName(), UsaCatA.type) // 美短逗逗 USA
var UsaCatB = new CatOfUsa('美短雪饼')
console.log(UsaCatB.getName(), UsaCatB.type) // 美短雪饼 USA

// 实例化英短猫
var UkCatA = new CatOfUk('英短逗逗')
console.log(UkCatA.getName(), UkCatA.type) // 英短逗逗 UK
var UkCatB = new CatOfUk('英短雪饼')
console.log(UkCatB.getName(), UkCatB.type) // 英短雪饼 UK
```

从打印结果上看，TypeCatFactory 这个抽象工厂很好的实现了它的作用，将猫按照不同品种这一个类簇进行了分类。这就是抽象工厂的作用，它不直接创建实例，而是通过类的继承进行类簇的管理。抽象工厂模式一般用在多人协作的超大型项目中，并且严格的要求项目以面向对象的思想进行完成。

## ES6中的工厂模式

ES6中给我们提供了 class 新语法，虽然 class 本质上是一颗语法糖，并也没有改变 JavaScript 是使用原型继承的语言，但是确实让对象的创建和继承的过程变得更加的清晰和易读。下面我们使用ES6的新语法来重写上面的例子。

### ES6重写简单工厂模式

```js
class PetMarket {
  constructor(opt) {
    this.name = opt.name
  }

  getInstance(pet) {
    switch(pet) {
      case 'cat':
        return new Pet({ name: 'cat'})
        break;
      case 'fish':
        return new Pet({ name: 'fish'})
        break;
      case 'dog':
        return new Pet({ name: 'dog'})
        break;
      default:
        throw new Error('参数错误, 可选参数:cat, fish, dog')
    }
  }  
}

let cat = PetMarket.getInstance('cat')
let fish = PetMarket.getInstance('fish')
let dog = PetMarket.getInstance('dog')
```

### ES6重写工厂方法模式

```js
class PetMarket {
  constructor(name) {
    // new.target 指向直接被 new 执行的构造函数
    if (new.target === PetMarket) {
      throw new Erorr('抽象类不能实例化')
    }
    this.name = name
  }
}

class PetMarketFactory extends PetMarket {
  constructor(name) {
    super(name)
  }
  create(pet) {
    case 'cat':
      return new PetMarketFactory('cat')
      break;
    case 'fish':
      return new PetMarketFactory('fish')
      break;
    case 'dog':
      return new PetMarketFactory('dog')
      break;
    default:
      throw new Error('参数错误, 可选参数:cat, fish, dog')
  }
}

let petMarketFactory = new PetMarketFactory()
let cat = petMarketFactory.create('cat')
let fish = petMarketFactory.create('fish')
let dog = petMarketFactory.create('dog')
```

### ES6重写抽象工厂模式

```js
class PetMarket {
  constructor(type) {
    if (new.target === PetMarket) {
      throw new Error('抽象类不能实例化')
    }
    this.type = type
  }
}

class CatOfUsa extends PetMarket {
  constructor(name) {
    super('UsaShorthair')
    this.name = name
  }
}

class CatOfUk extends PetMarket {
  constructor(name) {
    super('BritishShorthair')
    this.name = name
  }
}

const petMarketFactory = (type) => {
  switch (type) {
    case 'UsaShorthair':
      return CatOfUsa
      break;
    case 'BritishShorthair':
      return CatOfUk
      break;
    default:
      throw new Error('参数错误, 可选参数:UsaShorthair, BritishShorthair')
  }
}

let UsaCatClass = petMarketFactory('UsaShorthair')
let UkCatClass = petMarketFactory('BritishShorthair')

let UsaCatA = new UsaCatClass('美短雪饼')
let UkCatA = new UkCatClass('英短雪饼')
```