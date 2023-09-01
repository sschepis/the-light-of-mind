import React, { useState, useEffect } from 'react';
import { Parallax } from 'react-parallax';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

import book from './book.js';

import './App.css';


// fixed to the bottom of the screen - contains icons for social media
const SocialLinks = ({ facebook, twitter, discord }) => {

}

const NewsletterSignup = ({ chapters }) => {
  return (
    <section className="newsletter">
      <header className="newsletter__header">
        <Parallax
          bgImage={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + book.toc.imageUrl}
          bgImageAlt="Sign up to get notified when the book is available."
          strength={200}
          style={{ height: '100%' }}
          className='newsletter__parallax'
        >
          <img src={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + book.toc.imageUrl} alt="" className="newsletter__image" />
        </Parallax>
        <div className="newsletter__header-content">
          <h1 className="newsletter__title">Get the book</h1>
          <p className="newsletter__subtitle">Sign up to get notified when the book is available.</p>
          <form className="newsletter__form">
            <input className="newsletter__input" type="email" placeholder="Your email" />
            <button className="newsletter__submit">Notify me</button>
          </form>
        </div>
      </header>
    </section>
  );
}



// add useScrollY hook
const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollY;
};

const NavigationLink = ({ chapter, position, index }) => (
  <a href={`#${chapter.id}`} className={`ebook__navlink ebook__navlink--${position}`}>
    <span className="ebook__chapter">{position === 'current' ? 'Current chapter' : `Chapter ${index}`}</span>
    <span className="ebook__navtitle">{chapter.title}</span>
  </a>
);

const Chapter = ({ chapter, chapters }) => {
  const chapterIndex = chapters.findIndex(ch => ch.id === chapter.id);
  const previousChapter = chapters[chapterIndex - 1];
  const nextChapter = chapters[chapterIndex + 1];

  return (
    <section className="ebook" id={chapter.id}>
      <a name={chapter.id} />
      <header className="ebook__cover">
        {chapter.content.find(item => item.type === 'cover') && (
          <Parallax
            bgImage={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + chapter.content.find(item => item.type === 'cover').imageUrl}
            bgImageAlt=''
            strength={200}
            style={{ height: '100%', width: '100%' }}
            className='ebook__parallax'
          >
          <img src={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + chapter.content.find(item => item.type === 'cover').imageUrl} alt="" className="ebook__image" />
        </Parallax> )}

        <div className="ebook__header">
          <span className="ebook__eyebrow">{chapter.title}</span>
          <h1 className="ebook__title">{chapter.title}</h1>
          <p className="ebook__subtitle">{chapter.subtitle}</p>
        </div>
      </header>
      <div className="ebook__body">
        <nav className="ebook__navigation" role="navigation">
          {previousChapter && <NavigationLink chapter={previousChapter} position="previous" index={chapterIndex} />}
          <NavigationLink chapter={chapter} position="current" />
          {nextChapter && <NavigationLink chapter={nextChapter} position="next" index={chapterIndex + 1} />}
        </nav>
        <main className="ebook__content">
          {chapter.content.map((item, index) => {
            if (item.type === 'paragraph') {
              return <p key={index}>{item.imageUrl && (<img key={index} className="ebook__media" src={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + item.imageUrl} alt={item.alt} />)}{item.text}</p>;
            } else {
              return null;
            }
          })}
        </main>
      </div>
    </section>
  );
};

const TOC = ({ chapters }) => {
  return (
    <section className="toc">
      <header className="toc__header">
        <Parallax
          bgImage={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + chapters[0].content.find(item => item.type === 'image').imageUrl}
          bgImageAlt="Table of Contents"
          strength={200}
          style={{ height: '100%' }}
          className='toc__parallax'
        >
          {chapters[0].content.find(item => item.type === 'image').imageUrl && <img src={'https://media.githubusercontent.com/media/sschepis/the-light-of-mind/main/public/images/' + chapters[0].content.find(item => item.type === 'image').imageUrl} alt="" className="toc__image" />}
        </Parallax>
        <div className="toc__header-content">
          <h1 className="toc__title">Table of Contents</h1>
          {chapters.map((chapter, index) => (
            <a key={index} href={`#${chapter.id}`} className="toc__link">
              <span className="toc__chapter">Chapter {index + 1}</span>
              <span className="toc__title">{chapter.title}</span>
            </a>
          ))}
        </div>
      </header>
    </section>
  );
}

const BookCover = ({title, subtitle, author, imageUrl, height = '100%' }) => {
  // fade the cover image into the background as the user scrolls
  const scrollY = useScrollY();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const totalHeight = document.querySelector(".book").clientHeight;
    const visibleHeight = window.innerHeight;
    setOffset(scrollY / (totalHeight - visibleHeight));
  }, [scrollY]);

  return (
    <section className="book__cover">
      <div className="book__header-content">
        <h1 className="book__title">{title}</h1>
        <h2 className="book__subtitle">{subtitle}</h2>
        <h3 className="book_author">{author}</h3>
      </div>
      <div className="book-cover__overlay" style={{ opacity: 1 - offset }} />
    </section>
  );
}

const HeaderNavigationBar = ({ chapters, onGotoTOC }) => {
  const scrollY = useScrollY();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalHeight = document.querySelector(".book").clientHeight;
    const visibleHeight = window.innerHeight;
    setProgress(scrollY / (totalHeight - visibleHeight));
  }, [scrollY]);

  const progressBarStyle = {
    transform: `scaleX(${progress})`,
  };

  const handleClick = () => {
    onGotoTOC();
  };

  return (
    <div className="header-navigation-bar">
      <div className="header-navigation-bar__chapter">
        <h1 className="header-navigation-bar__title">{chapters[0].title}</h1>
        <h2 className="header-navigation-bar__subtitle">{chapters[0].subtitle}</h2>
      </div>
      <div className="header-navigation-bar__progress">
        <div className="header-navigation-bar__progress-bar">
          <div style={progressBarStyle} />
        </div>
      </div>
      <div className="header-navigation-bar__toc">
        <button className="header-navigation-bar__toc-button" onClick={handleClick}>Table of Contents</button>
      </div>
    </div>
  );
};

const Book = () => {

  const scrollToTOC = () => {
    scroll.scrollToTop(); // Scroll to top instead of the TOC section to show the book cover as well
  };

  return (
    <>
      {/* <HeaderNavigationBar chapters={book.chapters} onGotoTOC={scrollToTOC} /> */}
      <div className="book" style={{ marginTop: '0' }}>
        <BookCover
          title={book.title}
          subtitle={book.subtitle}
          author={book.author}
          imageUrl={book.coverImageUrl}
        />
        <TOC chapters={book.chapters} />
        {book.chapters.map((chapter, index) => (
          <Chapter key={index} chapter={chapter} chapters={book.chapters} />
        ))}
        <NewsletterSignup />
      </div>
    </>
  );
};

export default Book;