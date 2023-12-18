import React from 'react'

const CategorySelect = (props) => {
    const {categoryList} =  props 
    return (
        categoryList.map((category) => <MyOption category={category} currentLevel={0} />)

    )
}

export default CategorySelect

const MyOption = (props) => {
    const { category, currentLevel } = props
    let padding = ""
    for (let i = 0; i < currentLevel; i++) {
        padding += "\u00a0\u00a0\u00a0\u00a0"
    }
    try {
        return (
            [
                <option key={category.key} value={category.uuid} >
                    {padding + category.name}
                </option>,
                ...category.children?.map((subCategory) => <MyOption category={subCategory} currentLevel={currentLevel + 1} />)
            ]
        )
    } catch (error) {
        console.log(category)
        return []
    }
}