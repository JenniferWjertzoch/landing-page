'use strict'


const config = {
    cssClasses: {
        scrollDown: 'scroll-down',
        scrollUp: 'scroll-up',
        active: 'active',
        hidden: 'hidden'
    },
    selectors: {
        mainNav: '',
        footerNav: ''
    }
}

const Helpers = (function () {
    /**
     *
     * @param toggle
     * @param target
     */
    const toggleVisibility = (toggle, target) => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle(config.cssClasses.active)
            target.classList.toggle(config.cssClasses.hidden)
        })
    }

    return {
        toggleVisibility: (toggle, target) => toggleVisibility(toggle, target)
    }
})(config)

const LandingPage = (function() {

    // Would like to discuss notes and hints about this whole file in person
    // Code styling improved already a lot, but it seems like it's still an issue, I miss a couple of spaces

    // const dropdownBtn = document.querySelector('[data-element=menu-icon]')
    // const menuContent = document.querySelector('[data-element=menu]')

    const getDOMElement = selector => document.querySelector(selector)

    const dropdownMenu = function() {
        const dropdownBtn = getDOMElement('[data-element=menu-icon]')
        const menuContent = getDOMElement('[data-element=menu]')

        Helpers.toggleVisibility(dropdownBtn, menuContent)
    }

    // const body = document.body
    // const button = document.querySelector('[data-element=top-button]')

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

    const backToTopButton = function(config) {
        const toTopButton = getDOMElement('[data-element=top-button]')

        toTopButton.addEventListener('click', () => {
            document.body.scrollTop = 0 // For Safari
            document.documentElement.scrollTop = 0 // For Chrome, Firefox and Opera
            // Bring back the menu
            document.body.classList.remove(config.cssClasses.scrollDown)
            document.body.classList.add(config.cssClasses.scrollUp)
        })
    }

    const hideHeaderOnScroll = function(config) {
        let lastPageYOffset = 0

        window.addEventListener('scroll', () => {
            const pageYOffset = window.pageYOffset

            if (pageYOffset == 0) {
                document.body.classList.remove(config.cssClasses.scrollUp)

                return
            }

            if (pageYOffset >= lastPageYOffset && !document.body.classList.contains(config.cssClasses.scrollDown)) {
                // Scroll down
                document.body.classList.remove(config.cssClasses.scrollUp)
                document.body.classList.add(config.cssClasses.scrollDown)
            } else {
                // Scroll up
                document.body.classList.remove(config.cssClasses.scrollDown)
                document.body.classList.add(config.cssClasses.scrollUp)
            }

            lastPageYOffset = pageYOffset
        })
    }

    // const allSections = Array.from(document.querySelectorAll('section'))
    // const headerNav = document.querySelector('nav.menu')
    // const footerNav = document.querySelector('nav.nav-left')

    const setLinkAction = function (link) {
        link.addEventListener('click', event => {
            event.preventDefault()
            const hrefValue = link.getAttribute('href')
            const section = document.querySelector(hrefValue)

            history.pushState(null, null, hrefValue)

            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        })

        return link
    }

    const getNavLinks = function() {
        const allSections = Array.from(document.querySelectorAll('[data-element=section]'))

        // Example: return [navLink, false, navLink]
        return allSections.map(section => {
            let navLink = document.createElement('a')

            if (!section.id) return false

            const navLinkHref = `#${section.id}`
            const navLinkText = section.querySelector('[data-element=content-title]') ? section.querySelector('[data-element=content-title]').innerText : navLinkHref.replace('-', ' ')

            navLink.setAttribute('href', navLinkHref)
            navLink.innerText = navLinkText
            navLink = setLinkAction(navLink)

            // headerNav.appendChild(newAnchorTag)
            // const anchorTagClone = newAnchorTag.cloneNode(true)
            // footerNav.appendChild(anchorTagClone)

            return navLink
        })
    }

    const createNav = function (navElement) {
        const navLinks = getNavLinks()

        navLinks.forEach(link => navElement.appendChild(link))
    }

    const activeLinkOnScroll = function(navLinks) {
        window.addEventListener('scroll', () => {
            const fromTop = window.scrollY + 100

            navLinks.forEach(link => {
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

    const init = function(config) {
        const navLinks = Array.from(document.querySelectorAll('[data-element=menu] a'))

        dropdownMenu()
        createNav(getDOMElement('[data-element=menu]'))
        createNav(getDOMElement('[data-element=footer-nav]'))
        activeLinkOnScroll(navLinks)
        hideHeaderOnScroll(config)
        backToTopButton(config)
        buttonOnScroll()
    }

    return {
        init: config => init(config)
    }

})()

document.addEventListener('DOMContentLoaded', () => LandingPage.init(config))
