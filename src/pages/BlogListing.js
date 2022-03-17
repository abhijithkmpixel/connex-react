import React,{useState , useEffect} from 'react'
import { Banner } from './Press'
import CategorySelector from '../components/CategorySelector'
import EmailNewsletter from '../components/EmailNewsletter'
import InstagramGrid from '../components/InstagramGrid'
import LatestBlogs from '../components/LatestBlogs'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
const BlogListing = () => {
  const [blogBanner, setblogBanner] = useState()
  const [blogList, setblogList] = useState()
  const [currentPage, setcurrentPage] = useState(1)
  const [itemsPerPage, setitemsPerPage] = useState(3)
  var totalItems = blogList?.post_details.length;
  var totalPages = Math.ceil(totalItems / itemsPerPage);
  var indexOfLast = currentPage * itemsPerPage;
  var indexOfOne = indexOfLast - itemsPerPage;
  
  var posts = blogList?.post_details.slice(indexOfOne, indexOfLast)
  console.log(posts);
  useEffect(() => {
    fetch('https://safqat.pixelflames.net/wp-json/acf/v3/pages?slug[]=blog')
    .then(response => response.json())
    .then(json => {setblogBanner(json) ;})  

    fetch('https://safqat.pixelflames.net/wp-json/wp/v2/posts?post_type=blog')
    .then(response => response.json())
    .then(json => {setblogList(json) ;})  
    return () => {
      // second
    }
  }, [])
const changePagination =(number)=>{
  setcurrentPage(number)
}
const handlePaginate =(data)=>{
  setcurrentPage(data.selected + 1)
}
  return (
    <>
    {
      blogBanner?.map(data =>{
        return <Banner bannerImage={data.acf.banner_image} bannerTitle={data.acf.banner_title}/>
      })
    }
   
    <section className="pixel_blog_listing_section">
  <div className="container">
    <div className="pixel_blog_listing_section_wrap row">
      <div className="col-md-8 col-12">
        {
          blogList?.post_details? <BlogList list={posts } /> :<h4 className='text-center color-primary'>Loading...</h4>
        }
         
         {
           totalPages > 1 &&
         <div className="pagination-wrap justify-content-start">
            <span onClick={()=>changePagination(1)} >
                  <a href='#'>First</a>
                </span>
            <ReactPaginate pageRangeDisplayed={2}  pageCount={totalPages} breakClassName={'a-disabled'} breakLinkClassName={'a-disabled'} pageRangeDisplayed={2} marginPagesDisplayed={2}  containerClassName={' a-pagination'} onPageChange={handlePaginate}  previousLabel={<img src="uploads/products/left-ar.svg" />} activeClassName={'active'}	 breakLabel={"..."} nextLabel={<img src="uploads/products/right-ar.svg" />} pageClassName={'a-selected'} forcePage={currentPage - 1}/>
            <span onClick={()=>changePagination(totalPages)}>
                  <a  href='#'>Last</a>
                </span>
         </div>
         }

    
      </div>
      <div className="col-md-4 col-12">
         <LatestBlogs />
         <CategorySelector title='Categoris'  url='https://safqat.pixelflames.net/wp-json/wp/v2/blog-category'/>
          <InstagramGrid />
          <EmailNewsletter/>
      </div>
    </div>
  </div>
</section>
    </>
  )
}

const BlogList= (props)=>{
  return(
    <ul className="blogs_listing_block">
      {
        props.list?.map(item =>{
          return (
            <li  key={item.id}>
              <Link className="blog" to={`/blog-details?id=${item.id}`}>
                <div className="blog_image_wrap">
                  <img src={item.featured_image.src} alt="image"/>
                </div>
                <div className="blog_details">
                  <span>{item.post_date}</span>
                  <h4>{item.name}</h4>
                  <div dangerouslySetInnerHTML={{__html:item.post_excerpt}}></div>
                </div>
              </Link>
          </li>
          )
        })
      }
  </ul>
  )
}
export default BlogListing