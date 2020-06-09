'use strict'

const LandingPage = (function() {

    const dropdownBtn = document.querySelector('[data-element=menu-icon]')
    const menuContent = document.querySelector('[data-element=menu]')

    const dropdownMenu = function() {
        dropdownBtn.addEventListener('click',() => {
            if(menuContent.style.display===''){
               menuContent.style.display='block'
            } else {
               menuContent.style.display=''
            }
            dropdownBtn.classList.toggle('active')
        })
    }

    const body = document.body
    const button = document.querySelector('[data-element=top-button]')

    const buttonOnScroll = function() {
        window.onscroll = function() {scrollFunction()}
        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                document.querySelector('[data-element=top-button]').style.display = 'block'
            } else {
                document.querySelector('[data-element=top-button]').style.display = 'none'
            }
        }
    }

    const backToTopButton = function() {
        button.addEventListener('click',() => {
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox and Opera
            // Bring back the menu
            body.classList.remove('scroll-down')
            body.classList.add('scroll-up')
        })
    }

    const hideHeaderOnScroll = function() {
        const scrollUp = 'scroll-up'
        const scrollDown = 'scroll-down'
        let lastScroll = 0

        window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset
        if (currentScroll == 0) {
            body.classList.remove(scrollUp)
            return
        }

        if (currentScroll > lastScroll && !body.classList.contains(scrollDown)) {
            // Scroll down
            body.classList.remove(scrollUp)
            body.classList.add(scrollDown)
        } else if (currentScroll < lastScroll && body.classList.contains(scrollDown)) {
            // Scroll up
            body.classList.remove(scrollDown)
            body.classList.add(scrollUp)
        }
        lastScroll = currentScroll
        })
    }

    const allSections = Array.from(document.querySelectorAll('section'))
    const headerNav = document.querySelector('nav.menu')
    const footerNav = document.querySelector('nav.nav-left')

    const createLinkElement = function() {
        allSections.forEach((section, index) => {
            const newAnchorTag = document.createElement('a')
            const addIdSectionElement = `#section${index + 1}`

            newAnchorTag.setAttribute('href', addIdSectionElement)
            newAnchorTag.innerHTML = `Section ${index + 1}`

            headerNav.appendChild(newAnchorTag)
            const anchorTagClone = newAnchorTag.cloneNode(true)
            footerNav.appendChild(anchorTagClone)

            newAnchorTag.addEventListener('click', event => {
                event.preventDefault()
                const hashVal = newAnchorTag.getAttribute('href')
                const element = document.querySelector(hashVal)

                history.pushState(null, null, hashVal)

                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            })

        })
    }

    const activeLinkOnScroll = function() {
        const mainNavLinks = document.querySelectorAll('nav.menu a')

        window.addEventListener('scroll', () => {
            const fromTop = window.scrollY + 100

            mainNavLinks.forEach(link => {
                const section = document.querySelector(link.hash)
                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    link.classList.add('is-active')
                    section.classList.add('section-is-active')
                } else {
                    link.classList.remove('is-active')
                    section.classList.remove('section-is-active')
                }
            })
        })
    }

    const init = function() {
        dropdownMenu()
        createLinkElement()
        activeLinkOnScroll()
        hideHeaderOnScroll()
        backToTopButton()
        buttonOnScroll()
    }

    return {
        init: init,
    }

})()

document.addEventListener('DOMContentLoaded', LandingPage.init)