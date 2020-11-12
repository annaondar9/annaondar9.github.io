window.onload = () => {
  const teachers = [
    {
      id: 1,
      text: 'Батенькина Оксана Васильевна'
    },
    {
      id: 2,
      text: 'Большакова Мария Сергеевна'
    },
    {
      id: 3,
      text: 'Голунов Александр Владимирович'
    },
    {
      id: 4,
      text: 'Котюргина Александра Станиславовна'
    },
    {
      id: 5,
      text: 'Макарова Таисья Васильевна'
    },
    {
      id: 6,
      text: 'Ровкина Вероника Дмитриевна'
    },
    {
      id: 7,
      text: 'Степаненко Алексей Николаевич'
    },
    {
      id: 8,
      text: 'Тиховская Светлана Валерьевна'
    },
    {
      id: 9,
      text: 'Чемерилов Александр Сергеевич'
    },
    {
      id: 10,
      text: 'Шевелева Ольга Геннадьевна'
    },
    {
      id: 11,
      text: 'Юдин Евгений Борисович'
    }
  ]

  const subjects = [
    {
      id: 1,
      text: 'Технологии виртуальной реальности'
    },
    {
      id: 2,
      text: 'Дизайн интерфейса информационных систем'
    },
    {
      id: 3,
      text: 'Информационные технологии в PreMedia'
    },
    {
      id: 4,
      text: 'Системный анализ'
    },
    {
      id: 5,
      text: 'Технологии создания гипертекстовых систем'
    },
    {
      id: 6,
      text: 'Управление информационными проектами и ресурсами'
    },
    {
      id: 7,
      text: 'Трехмерное компьютерное моделирование'
    },
    {
      id: 8,
      text: 'Интеллектуальные системы в медиаиндустрии'
    },
    {
      id: 9,
      text: 'Технологии анимации'
    },
    {
      id: 10,
      text: 'Проектная деятельность'
    },
    {
      id: 11,
      text: 'Объектно-ориентированное программирование'
    }
  ]

  const positions = [
    {
      id: 1,
      text: 'доцент, кандидат технических наук'
    },
    {
      id: 2,
      text: 'ассистент'
    },
    {
      id: 3,
      text: 'доцент, кандидат технических наук'
    },
    {
      id: 4,
      text: 'доцент, кандидат технических наук'
    },
    {
      id: 5,
      text: 'доцент, кандидат педагогических наук'
    },
    {
      id: 6,
      text: 'старший преподаватель'
    },
    {
      id: 7,
      text: 'старший преподаватель'
    },
    {
      id: 8,
      text: 'доцент, кандидат физико-математических наук'
    },
    {
      id: 9,
      text: 'ассистент'
    },
    {
      id: 10,
      text: 'старший преподаватель'
    },
    {
      id: 11,
      text: 'доцент, кандидат технических наук'
    }
  ]

  const store = {}

  const DnD = {
    drag: {
      over: event => {
        if (isNotSuccess(event.target)) event.preventDefault();
      },
      start: (event) => {
        const $item = event.target
        setTimeout(() => {
          if ($item.style) $item.style.display = 'none'
        }, 0)
      },
      end: event => {
        const $item = event.target //? блок, который мы переместили
        if ($item.style) $item.style.display = 'block'

        const { $oldItem } = store //? блок, который находился в ячейке, в которую мы переместили новый блок
        if ($oldItem) {
          const $newCell = $oldItem.parentElement //? ячейка, из которой мы взяли блок
          const $oldCell = $item.parentElement //? ячейка, в которую мы переместили блок

          const oldCol = $oldCell.dataset.col
          const newCol = $newCell.dataset.col

          if (oldCol === newCol && isNotSuccess($item)) {
            $newCell.append($item)
            $oldCell.append($oldItem)

            const $newLine = $newCell.parentElement
            const $oldLine = $oldCell.parentElement

            const newLineId = getId($newLine.querySelectorAll('.item'))
            const oldLineId = getId($oldLine.querySelectorAll('.item'))

            compareId($newLine, newLineId)
            compareId($oldLine, oldLineId)
          }
        }
      }
    },
    drop: event => {
      store.$oldItem = event.target
    }
  }

  const isNotSuccess = $el => !$el.parentElement.parentElement.classList.contains('success')

  const compareId = ($line, id) => {
    if (id[0] === id[1]) {
      if (id[0] === id[2]) success($line)
      else {
        const currentPosition = positions.find(position => position.id == id[2]).text
        const samePositions = positions.filter(position => position.text === currentPosition)
        samePositions.forEach(position => {
          if (position.id == id[0]) success($line)
        })
      }
    }
  }

  const success = $line => {
    $line.classList.add('success')
    disableDraggable($line)
    store.counter -= 1
    if (!store.counter) {
      const { $puzzle, $win } = store
      $puzzle.style.display = 'none'
      $win.style.display = 'block'
    }
  }

  const disableDraggable = $line => {
    const $items = $line.querySelectorAll('.item')
    $items.forEach($item => $item.setAttribute('draggable', false))
  }

  const getId = $elems => [...$elems].map($el => $el.dataset.id)

  const randomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const createCell = ($line, { id, text }, colNumber) => {
    const $cell = document.createElement('div');
    const $item = document.createElement('div');
    const $text = document.createTextNode(text)
    $cell.classList.add('cell')
    $item.classList.add('item')
    $item.setAttribute('data-id', id)
    $cell.setAttribute('data-col', colNumber)
    $item.setAttribute('draggable', true)
    $line.append($cell)
    $cell.append($item)
    $item.append($text)
    $cell.ondragover = DnD.drag.over
    $cell.ondrop = DnD.drop
    $item.ondragstart = DnD.drag.start
    $item.ondragend = DnD.drag.end
  }

  const render = linesNumber => {
    const $lines = []
    for (let index = 0; index < linesNumber; index++) {
      const $line = document.createElement('div');
      $line.classList.add('line')
      store.$puzzle.append($line)
      $lines.push($line)
    }
    const usedTeachers = []
    const usedSubjects = []
    const usedPositions = []
    $lines.forEach(($line, lineIndex) => {
      let randomTeachersIndex;
      let randomSubjectsIndex;
      let randomPositionsIndex;

      do {
        randomTeachersIndex = randomInt(linesNumber)
      } while (usedTeachers.includes(randomTeachersIndex))
      usedTeachers.push(randomTeachersIndex)

      do {
        randomSubjectsIndex = randomInt(linesNumber)
      } while (
        usedTeachers[lineIndex] === randomSubjectsIndex
        || usedSubjects.includes(randomSubjectsIndex))
      usedSubjects.push(randomSubjectsIndex)

      do {
        randomPositionsIndex = randomInt(linesNumber)
      } while (
        usedTeachers[lineIndex] === randomPositionsIndex
        || usedSubjects[lineIndex] === randomPositionsIndex
        || usedPositions.includes(randomPositionsIndex))
      usedPositions.push(randomPositionsIndex)

      createCell($line, teachers[randomTeachersIndex], 1)
      createCell($line, subjects[randomSubjectsIndex], 2)
      createCell($line, positions[randomPositionsIndex], 3)
      store.counter = linesNumber
    })
  }

  store.$main = document.querySelector('.main')
  store.$mainButton = store.$main.querySelector('.main__button')
  store.$puzzle = document.querySelector('.puzzle')
  store.$win = document.querySelector('.win')

  store.$mainButton.onclick = () => {
    store.$main.style.display = 'none'
    store.$puzzle.style.display = 'block'
    render(11)
  }
}
